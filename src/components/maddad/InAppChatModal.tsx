"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  IconCheck,
  IconLock,
  IconSend,
  IconShieldCheck,
  IconUser,
  IconWrench,
  IconX,
  IconClock,
  IconAlertCircle,
  IconArrowRight,
} from "../icons";
import { Dialog, fmtDate, fmtDateTime, pkr } from "./shared";
import { useI18n } from "./I18nContext";
import { getJobMessagesAction, sendJobMessageAction, ChatMessageDto } from "@/app/actions";
import type { AppUser, PublicJobItem } from "./types";

interface InAppChatModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  area: string;
  isCustomer: boolean;
  counterpartName?: string;
  counterpartSubtitle?: string;
  quotedAmount?: number | null;
  onAcceptQuote?: () => void;
  user: AppUser | null;
}

export function InAppChatModal({
  open,
  onClose,
  jobId,
  jobTitle,
  area,
  isCustomer,
  counterpartName,
  counterpartSubtitle,
  quotedAmount,
  onAcceptQuote,
  user,
}: InAppChatModalProps) {
  const { locale } = useI18n();
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick reply suggestions for speedy communication
  const customerQuickReplies = [
    locale === "ur" ? "کیا اس میں سامان شامل ہے یا صرف مزدوری؟" : "Does this quote include parts or labour only?",
    locale === "ur" ? "کیا آپ جلدی پہنچ سکتے ہیں؟" : "Can you arrive earlier?",
    locale === "ur" ? "کتنے منٹ میں پہنچ سکتے ہیں؟" : "How many minutes until you can arrive?",
    locale === "ur" ? "ریٹ میں کچھ رعایت ہو سکتی ہے؟" : "Is there any room for discount on this rate?",
  ];

  const workerQuickReplies = [
    locale === "ur" ? "جی، میرے پاس سارے اوزار اور میٹر موجود ہے۔" : "Yes, all tools and test equipment are ready.",
    locale === "ur" ? "میں اگلے 30 منٹ میں پہنچ سکتا ہوں۔" : "I can arrive within 30 minutes.",
    locale === "ur" ? "سامان کے پیسے رسید کے مطابق الگ ہوں گے۔" : "Parts cost will be separate per market receipt.",
    locale === "ur" ? "میں آپ کے علاقے کے قریب ہی ہوں۔" : "I am already nearby in your neighborhood.",
  ];

  const quickReplies = isCustomer ? customerQuickReplies : workerQuickReplies;

  // Fetch messages on open
  useEffect(() => {
    if (!open || !jobId) return;

    let active = true;
    setLoading(true);
    setError(null);

    getJobMessagesAction(jobId)
      .then((data) => {
        if (active) {
          setMessages(data || []);
        }
      })
      .catch((err) => {
        if (active) setError(err?.message || "Failed to load chat history.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, jobId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (!open) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || text.length < 2) return;

    setSending(true);
    setError(null);

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const myRole = isCustomer ? "customer" : "worker";
    const myName = isCustomer
      ? `You (${area})`
      : (user?.display_name?.replace(/^\[DEMO\]\s*/, "") || "You (Technician)");

    const optimisticMsg: ChatMessageDto = {
      id: tempId,
      job_id: jobId,
      sender_id: user?.id || "guest",
      sender_role: myRole,
      sender_name: myName,
      message: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");

    try {
      const res = await sendJobMessageAction(jobId, text);
      if (res?.error) {
        setError(res.error);
        // Remove optimistic message if error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      } else if (res?.message) {
        // Replace temp with saved message
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? res.message! : m))
        );
      }
    } catch (err: any) {
      setError(err?.message || "Could not send message.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const resolvedCounterpartTitle = counterpartName || (isCustomer ? "Verified Local Technician" : `Customer (${area})`);
  const resolvedCounterpartSub = counterpartSubtitle || (isCustomer ? "Independent craftsman in Lahore" : "Homeowner in Lahore");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--violet-soft)",
              color: "var(--violet-500)",
              display: "grid",
              placeItems: "center",
              fontSize: "0.9rem",
            }}
          >
            💬
          </div>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)" }}>
              {resolvedCounterpartTitle}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 500 }}>
              {resolvedCounterpartSub}
            </div>
          </div>
        </div>
      }
      eyebrow={
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--violet-400)" }}>
          <IconLock size={12} />
          <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {locale === "ur" ? "محفوظ ان-ایپ پرائیویٹ چیٹ (پوشیدہ نمبرز)" : "Masked Phone In-App Chat"}
          </span>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", height: "540px", maxHeight: "75vh" }}>
        {/* Top Privacy & Context Bar */}
        <div
          style={{
            padding: "10px 14px",
            background: "var(--graphite-2)",
            borderRadius: "var(--r-sm)",
            border: "1px solid var(--line-soft)",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--text-2)" }}>
            <IconShieldCheck size={16} style={{ color: "var(--violet-400)", flexShrink: 0 }} />
            <span>
              <strong>{jobTitle}</strong> · {area}
              {quotedAmount ? ` · Quote: ${pkr(quotedAmount)}` : ""}
            </span>
          </div>

          {isCustomer && onAcceptQuote && (
            <button
              type="button"
              onClick={onAcceptQuote}
              className="btn btn-primary btn-sm"
              style={{ fontSize: "0.78rem", padding: "5px 12px" }}
            >
              <IconCheck size={13} />
              <span>{locale === "ur" ? "کوٹیشن قبول کریں" : "Accept & Hire"}</span>
            </button>
          )}
        </div>

        {/* Message Stream */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px 6px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "rgba(0,0,0,0.2)",
            borderRadius: "var(--r-sm)",
            border: "1px solid var(--line-soft)",
          }}
        >
          {/* Welcome Banner */}
          <div
            style={{
              padding: "10px 12px",
              background: "rgba(139, 92, 246, 0.08)",
              border: "1px dashed var(--violet-line)",
              borderRadius: "var(--r-sm)",
              fontSize: "0.78rem",
              color: "var(--violet-300)",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            🛡️ <strong>{locale === "ur" ? "مکمل رازداری:" : "Privacy-First Conversation:"}</strong>{" "}
            {locale === "ur"
              ? "دونوں طرف کے موبائل نمبرز اور گھر کا پتہ پوشیدہ ہیں۔ ریٹ، سامان اور وقت طے کریں۔ کوٹیشن قبول کرنے پر براہ راست واٹس ایپ کنیکٹ ان لاک ہوگا۔"
              : "Phone numbers and street addresses remain strictly masked. Use this chat to confirm scope, parts, and timing. Direct WhatsApp unlocks upon mutual acceptance."}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 24, color: "var(--text-3)", fontSize: "0.85rem" }}>
              Loading chat messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 16px", color: "var(--text-3)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>💬</div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>
                {locale === "ur" ? "گفتگو شروع کریں" : "Start the conversation"}
              </div>
              <div style={{ fontSize: "0.8rem", marginTop: 4 }}>
                {locale === "ur"
                  ? "کوٹیشن کے متعلق کوئی بھی سوال یا وضاحت یہاں پوچھیں۔"
                  : "Send a message to discuss repair requirements, arrival time, or pricing."}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isMe =
                (isCustomer && m.sender_role === "customer") ||
                (!isCustomer && m.sender_role === "worker") ||
                (user && m.sender_id === user.id);

              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    alignSelf: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-3)",
                      marginBottom: 3,
                      paddingInline: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{m.sender_name}</span>
                    <span>·</span>
                    <span>
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                      background: isMe ? "var(--violet-600)" : "var(--graphite-2)",
                      color: isMe ? "#ffffff" : "var(--text)",
                      border: isMe ? "none" : "1px solid var(--line)",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              padding: "8px 12px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid var(--bad)",
              borderRadius: "var(--r-sm)",
              color: "var(--bad)",
              fontSize: "0.8rem",
              marginTop: 6,
            }}
          >
            {error}
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingTop: 8,
            paddingBottom: 4,
            scrollbarWidth: "none",
          }}
        >
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qr)}
              disabled={sending}
              style={{
                background: "var(--graphite-2)",
                border: "1px solid var(--line-soft)",
                borderRadius: "var(--r-pill)",
                padding: "4px 10px",
                fontSize: "0.74rem",
                color: "var(--text-2)",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--violet-500)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--line-soft)";
                e.currentTarget.style.color = "var(--text-2)";
              }}
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder={
              locale === "ur"
                ? "پیغام لکھیں (فون نمبر پوشیدہ رہتا ہے)..."
                : "Type your message (phone numbers stay masked)..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--line)",
              background: "var(--graphite-2)",
              color: "var(--text)",
              fontSize: "0.9rem",
            }}
          />

          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="btn btn-primary btn-sm"
            style={{ padding: "10px 16px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <IconSend size={15} />
            <span>{sending ? "..." : locale === "ur" ? "بھیجیں" : "Send"}</span>
          </button>
        </form>
      </div>
    </Dialog>
  );
}
