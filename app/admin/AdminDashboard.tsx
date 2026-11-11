'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Download, Loader2, LogOut, Mail, Moon, Search, Shield, Sun, Trash2, Users } from 'lucide-react';
import styles from './AdminDashboard.module.css';

type AdminLanguage = 'en' | 'ar';
type AdminRole = 'ADMIN' | 'STAFF';
type AdminTheme = 'light' | 'dark';

const ADMIN_THEME_STORAGE_KEY = 'nilorigen-admin-theme';

const COPY = {
  en: {
    workspace: 'Admin workspace', title: 'Export administration', description: 'Manage subscribers, client inquiries, and export campaigns.',
    logout: 'Log out', signingOut: 'Signing out…', language: 'العربية', switchToLight: 'Switch to light mode', switchToDark: 'Switch to dark mode',
    totalSubscribers: 'Total newsletter subscribers', subscribersLive: 'Live count from your SQLite database',
    totalInquiries: 'Total export inquiries', pendingInquiries: 'Pending inquiries', closedCompleted: 'Closed / completed',
    campaignDelivery: 'Campaign delivery', readyToSend: 'Ready to send', campaignSecure: 'Campaigns are sent through the secured email integration.',
    composeCampaign: 'Compose campaign', campaignDescription: 'A luxury branded HTML email will be sent to every subscriber.',
    emailSubject: 'Email subject', headline: 'Headline', messageBody: 'Message body',
    campaignPlaceholder: 'Write paragraphs on separate lines.\nStart bullet points with -, * or •.',
    noSubscribersCampaign: 'There are no subscribers to send this campaign to.',
    confirmCampaign: 'Send this campaign to all subscribers?', sendingCampaign: 'Sending campaign…',
    sendCampaign: 'Send newsletter to all subscribers', accepted: 'emails accepted.',
    failedEmails: 'failed. Review delivery details and try again.',
    subscribersTab: 'Newsletter subscribers', inquiriesTab: 'Export inquiries', subscriberList: 'Subscribers',
    matchingRecords: 'matching records', searchSubscribers: 'Search email address', emailAddress: 'Email address',
    subscribedOn: 'Subscribed on', noSearchSubscribers: 'No subscribers match your search.', noSubscribers: 'No subscribers yet.',
    previous: 'Previous', next: 'Next', page: 'Page', inquiriesNewest: 'Export requests, newest first',
    totalInquiryCount: 'total inquiries', filterStatus: 'Status', allStatuses: 'All statuses',
    pending: 'Pending', responded: 'Responded', closed: 'Closed', noInquiries: 'No export inquiries have been received yet.',
    noFilteredInquiries: 'No inquiries match these filters.', searchInquiries: 'Search name, company, email, or country',
    sortBy: 'Sort by', newest: 'Newest first', oldest: 'Oldest first', contact: 'Contact',
    corporateEmail: 'Corporate email', destination: 'Destination', specifications: 'Order specifications',
    submitted: 'Submitted', status: 'Status', detailsReply: 'Details & conversation', client: 'Client',
    company: 'Company', initialSpecifications: 'Initial specifications', conversation: 'Conversation history',
    noReplies: 'No replies have been sent yet.', originalInquiry: 'Original inquiry', sent: 'Sent',
    failed: 'Failed', deliveryPending: 'Pending', details: 'View details & conversation',
    sendResponse: 'Send a response to the client', writeReply: 'Write a professional reply…',
    sendingResponse: 'Sending response…', sendResponseButton: 'Send response to client',
    replySent: 'Reply sent and recorded successfully.', replySavedStatusError: 'Reply sent, but its delivery status could not be saved.',
    replyFailed: 'Unable to send the reply. Please try again.', markClosed: 'Mark as closed', reopen: 'Reopen inquiry',
    statusUpdateFailed: 'Unable to update inquiry status.', inquiryClosed: 'Inquiry marked as closed.',
    inquiryReopened: 'Inquiry reopened.', updating: 'Updating…', adminSettings: 'Admin settings',
    staffManagement: 'Staff accounts', staffDescription: 'Create and disable operational staff accounts.',
    username: 'Username', password: 'Password', createStaff: 'Create staff account', creatingStaff: 'Creating…',
    staffCreated: 'Staff account created.', disable: 'Disable', enable: 'Enable', active: 'Active', disabled: 'Disabled',
    noStaff: 'No staff accounts yet.', passwordRequirements: '12+ characters with uppercase, lowercase, a number, and a symbol.',
    changePassword: 'Change password', currentPassword: 'Current password', newPassword: 'New password',
    confirmPassword: 'Confirm new password', savePassword: 'Update password', savingPassword: 'Updating…',
    passwordUpdated: 'Password updated. Please sign in again.', passwordMismatch: 'New passwords do not match.',
    exportCsv: 'Export subscribers (CSV)', delete: 'Delete', deleteSubscriberConfirm: 'Delete this subscriber permanently?',
    deleteInquiryConfirm: 'Delete this inquiry and its conversation permanently?',
    deleteFailed: 'Unable to delete this record.', security: 'Security', campaignError: 'Campaign sending failed.',
    logoutError: 'Unable to sign out. Please try again.', signInAgain: 'Sign in again',
    userCreateError: 'Unable to create staff account.', userDisableError: 'Unable to disable this account.',
    passwordError: 'Unable to update password. Please check the current password and requirements.',
    genericError: 'Something went wrong. Please try again.',
    emailCol: 'Email address', subscribedCol: 'Subscribed on', matching: 'matching records',
    noStatusMatches: 'No inquiries match these filters.', contactRecords: 'Contact records',
    contactRecordType: 'Contact record type', exportInquiries: 'Export inquiries',
    destinationCountry: 'Destination', submittedOn: 'Submitted', replyColumn: 'Details & reply',
    staffCreatedNotice: 'Staff account created.', passwordChangedNotice: 'Password updated. Please sign in again.',
    currentPasswordRequired: 'Enter your current password.', closeDialog: 'Close',
    disableStaffConfirm: 'Disable this staff account?', enableStaffConfirm: 'Enable this staff account?',
    logoutFailed: 'Unable to sign out. Please try again.',
  },
  ar: {
    workspace: 'مساحة الإدارة', title: 'إدارة التصدير', description: 'إدارة المشتركين واستفسارات العملاء وحملات التصدير.',
    logout: 'تسجيل الخروج', signingOut: 'جارٍ تسجيل الخروج…', language: 'English', switchToLight: 'التبديل إلى الوضع الفاتح', switchToDark: 'التبديل إلى الوضع الداكن',
    totalSubscribers: 'إجمالي مشتركي النشرة', subscribersLive: 'العدد الفعلي من قاعدة بيانات SQLite',
    totalInquiries: 'إجمالي استفسارات التصدير', pendingInquiries: 'الاستفسارات قيد الانتظار', closedCompleted: 'المغلقة / المكتملة',
    campaignDelivery: 'إرسال الحملات', readyToSend: 'جاهز للإرسال', campaignSecure: 'تُرسل الحملات عبر خدمة البريد الآمنة.',
    composeCampaign: 'إنشاء حملة', campaignDescription: 'سيتم إرسال رسالة HTML بتصميم العلامة التجارية إلى جميع المشتركين.',
    emailSubject: 'عنوان البريد', headline: 'العنوان الرئيسي', messageBody: 'نص الرسالة',
    campaignPlaceholder: 'اكتب كل فقرة في سطر منفصل.\nابدأ التعداد بإحدى العلامات -, * أو •.',
    noSubscribersCampaign: 'لا يوجد مشتركون لإرسال الحملة إليهم.',
    confirmCampaign: 'هل تريد إرسال الحملة إلى جميع المشتركين؟', sendingCampaign: 'جارٍ إرسال الحملة…',
    sendCampaign: 'إرسال النشرة إلى جميع المشتركين', accepted: 'رسالة قُبلت للإرسال.',
    failedEmails: 'رسائل فشلت. راجع تفاصيل الإرسال وحاول مجددًا.',
    subscribersTab: 'مشتركو النشرة', inquiriesTab: 'استفسارات التصدير', subscriberList: 'المشتركون',
    matchingRecords: 'سجل مطابق', searchSubscribers: 'البحث بالبريد الإلكتروني', emailAddress: 'البريد الإلكتروني',
    subscribedOn: 'تاريخ الاشتراك', noSearchSubscribers: 'لا توجد نتائج مطابقة.', noSubscribers: 'لا يوجد مشتركون بعد.',
    previous: 'السابق', next: 'التالي', page: 'صفحة', inquiriesNewest: 'طلبات التصدير، الأحدث أولًا',
    totalInquiryCount: 'إجمالي الاستفسارات', filterStatus: 'الحالة', allStatuses: 'كل الحالات',
    pending: 'قيد الانتظار', responded: 'تم الرد', closed: 'مغلق', noInquiries: 'لم تصل أي استفسارات تصدير بعد.',
    noFilteredInquiries: 'لا توجد استفسارات تطابق عوامل التصفية.', searchInquiries: 'بحث بالاسم أو الشركة أو البريد أو الدولة',
    sortBy: 'الترتيب', newest: 'الأحدث أولًا', oldest: 'الأقدم أولًا', contact: 'جهة الاتصال',
    corporateEmail: 'البريد المؤسسي', destination: 'الدولة المستهدفة', specifications: 'مواصفات الطلب',
    submitted: 'تاريخ الإرسال', status: 'الحالة', detailsReply: 'التفاصيل والمحادثة', client: 'العميل',
    company: 'الشركة', initialSpecifications: 'المواصفات الأولية', conversation: 'سجل المحادثة',
    noReplies: 'لم يتم إرسال أي رد بعد.', originalInquiry: 'الاستفسار الأصلي', sent: 'تم الإرسال',
    failed: 'فشل الإرسال', deliveryPending: 'قيد الإرسال', details: 'عرض التفاصيل والمحادثة',
    sendResponse: 'إرسال رد إلى العميل', writeReply: 'اكتب ردًا مهنيًا…',
    sendingResponse: 'جارٍ إرسال الرد…', sendResponseButton: 'إرسال الرد إلى العميل',
    replySent: 'تم إرسال الرد وتسجيله بنجاح.', replySavedStatusError: 'أُرسل الرد لكن تعذر حفظ حالة الإرسال.',
    replyFailed: 'تعذر إرسال الرد. يرجى المحاولة مجددًا.', markClosed: 'إغلاق الاستفسار', reopen: 'إعادة فتح الاستفسار',
    statusUpdateFailed: 'تعذر تحديث حالة الاستفسار.', inquiryClosed: 'تم إغلاق الاستفسار.',
    inquiryReopened: 'تمت إعادة فتح الاستفسار.', updating: 'جارٍ التحديث…', adminSettings: 'إعدادات الإدارة',
    staffManagement: 'حسابات الموظفين', staffDescription: 'إنشاء حسابات الموظفين التشغيليين وتعطيلها.',
    username: 'اسم المستخدم', password: 'كلمة المرور', createStaff: 'إنشاء حساب موظف', creatingStaff: 'جارٍ الإنشاء…',
    staffCreated: 'تم إنشاء حساب الموظف.', disable: 'تعطيل', enable: 'تفعيل', active: 'نشط', disabled: 'معطل',
    noStaff: 'لا توجد حسابات موظفين بعد.', passwordRequirements: '12 حرفًا فأكثر مع أحرف كبيرة وصغيرة ورقم ورمز.',
    changePassword: 'تغيير كلمة المرور', currentPassword: 'كلمة المرور الحالية', newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة', savePassword: 'تحديث كلمة المرور', savingPassword: 'جارٍ التحديث…',
    passwordUpdated: 'تم تحديث كلمة المرور. يرجى تسجيل الدخول مجددًا.', passwordMismatch: 'كلمتا المرور الجديدتان غير متطابقتين.',
    exportCsv: 'تصدير المشتركين (CSV)', delete: 'حذف', deleteSubscriberConfirm: 'هل تريد حذف هذا المشترك نهائيًا؟',
    deleteInquiryConfirm: 'هل تريد حذف هذا الاستفسار ومحادثته نهائيًا؟',
    deleteFailed: 'تعذر حذف هذا السجل.', security: 'الأمان', campaignError: 'تعذر إرسال الحملة.',
    logoutError: 'تعذر تسجيل الخروج. حاول مجددًا.', signInAgain: 'تسجيل الدخول مجددًا',
    userCreateError: 'تعذر إنشاء حساب الموظف.', userDisableError: 'تعذر تعطيل هذا الحساب.',
    passwordError: 'تعذر تحديث كلمة المرور. تحقق من الحالية ومتطلبات كلمة المرور.',
    genericError: 'حدث خطأ. يرجى المحاولة مجددًا.',
    emailCol: 'البريد الإلكتروني', subscribedCol: 'تاريخ الاشتراك', matching: 'سجل مطابق',
    noStatusMatches: 'لا توجد استفسارات تطابق عوامل التصفية.', contactRecords: 'سجلات التواصل',
    contactRecordType: 'نوع سجل التواصل', exportInquiries: 'استفسارات التصدير',
    destinationCountry: 'الدولة المستهدفة', submittedOn: 'تاريخ الإرسال', replyColumn: 'التفاصيل والرد',
    staffCreatedNotice: 'تم إنشاء حساب الموظف.', passwordChangedNotice: 'تم تحديث كلمة المرور. يرجى تسجيل الدخول مجددًا.',
    currentPasswordRequired: 'أدخل كلمة المرور الحالية.', closeDialog: 'إغلاق',
    disableStaffConfirm: 'هل تريد تعطيل حساب الموظف هذا؟', enableStaffConfirm: 'هل تريد تفعيل حساب الموظف هذا؟',
    logoutFailed: 'تعذر تسجيل الخروج. حاول مجددًا.',
  },
} as const;

export interface SubscriberRecord {
  id: number;
  email: string;
  createdAt: string;
}

export interface AdminUserRecord {
  id: number;
  username: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
}

export interface ContactInquiryRecord {
  id: number;
  fullName: string;
  company: string;
  email: string;
  destinationCountry: string;
  specifications: string;
  createdAt: string;
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  replies: InquiryReplyRecord[];
}

interface InquiryReplyRecord {
  id: number;
  message: string;
  status: string;
  senderEmail: string;
  createdAt: string;
  sentAt: string | null;
}

interface AdminDashboardProps {
  subscribers: SubscriberRecord[];
  inquiries: ContactInquiryRecord[];
  admin: { id: number; username: string; role: AdminRole };
  staff: AdminUserRecord[];
}

interface CampaignResponse {
  success: boolean;
  totalSubscribers?: number;
  totalSent?: number;
  failedCount?: number;
  error?: string;
  failures?: Array<{ index: number; error: string }>;
}

const PAGE_SIZE = 10;
const MAX_REPLY_LENGTH = 10_000;

function formatLocalDate(value: string, language: AdminLanguage): string {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function FormattedDate({
  value,
  className,
  language,
}: {
  value: string;
  className?: string;
  language: AdminLanguage;
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(formatLocalDate(value, language));
  }, [value, language]);

  return (
    <time dateTime={value} className={className} suppressHydrationWarning>
      {displayValue}
    </time>
  );
}

function inquiryStatusLabel(status: ContactInquiryRecord['status'], language: AdminLanguage): string {
  if (status === 'RESPONDED') return COPY[language].responded;
  if (status === 'CLOSED') return COPY[language].closed;
  return COPY[language].pending;
}

function inquiryStatusClass(status: ContactInquiryRecord['status']): string {
  if (status === 'RESPONDED') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (status === 'CLOSED') return 'border-slate-200 bg-slate-100 text-slate-600';
  return 'border-amber-200 bg-amber-50 text-amber-800';
}

function InquiryDetail({
  inquiry,
  language,
  canDelete,
  onDelete,
}: {
  inquiry: ContactInquiryRecord;
  language: AdminLanguage;
  canDelete: boolean;
  onDelete: (inquiryId: number) => Promise<void>;
}) {
  const router = useRouter();
  const t = COPY[language];
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const updateStatus = async (status: ContactInquiryRecord['status']) => {
    setError('');
    setNotice('');
    setIsUpdatingStatus(true);
    try {
      const response = await fetch('/api/admin/reply', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryId: inquiry.id, status }),
      });
      const result: { success?: boolean; error?: string } = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(t.statusUpdateFailed);
      }
      setNotice(status === 'CLOSED' ? t.inquiryClosed : t.inquiryReopened);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t.statusUpdateFailed);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSending(true);

    try {
      const response = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryId: inquiry.id, message }),
      });
      const result: { success?: boolean; error?: string; statusSaved?: boolean } = await response.json();

      if (!response.ok || !result.success) {
        router.refresh();
        throw new Error(t.replyFailed);
      }

      setMessage('');
      setNotice(
        result.statusSaved === false
          ? t.replySavedStatusError
          : t.replySent
      );
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t.replyFailed);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <details className="min-w-[220px] rounded-lg border border-[#D4AF37]/25 bg-[#F8F7F2] p-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <summary className="cursor-pointer text-xs font-semibold text-[#073B2A]">
        {t.details} ({inquiry.replies.length})
      </summary>
      <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
        <div className="grid gap-3 text-xs sm:grid-cols-2">
          <p><span className="font-semibold text-slate-500">{t.client}:</span> <span className="text-[#17372B]">{inquiry.fullName}</span></p>
          <p><span className="font-semibold text-slate-500">{t.company}:</span> <span className="text-[#17372B]">{inquiry.company}</span></p>
          <p className="break-all"><span className="font-semibold text-slate-500">{t.corporateEmail}:</span> <span dir="ltr" className="text-[#17372B]">{inquiry.email}</span></p>
          <p><span className="font-semibold text-slate-500">{t.destination}:</span> <span className="text-[#17372B]">{inquiry.destinationCountry}</span></p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.conversation}</h4>
          <ol className="mt-2 space-y-3">
            <li className="border-s-2 border-[#073B2A]/30 ps-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="font-medium text-[#073B2A]">{inquiry.fullName} · {t.originalInquiry}</span>
                <FormattedDate value={inquiry.createdAt} className="text-slate-500" language={language} />
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{inquiry.specifications}</p>
            </li>
            {inquiry.replies.map((reply) => (
              <li key={reply.id} className="border-s-2 border-[#D4AF37]/60 ps-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-medium text-[#073B2A]">{reply.senderEmail}</span>
                  <FormattedDate value={reply.sentAt ?? reply.createdAt} className="text-slate-500" language={language} />
                  <span className={
                    reply.status === 'SENT'
                      ? 'font-semibold text-emerald-700'
                      : reply.status === 'FAILED'
                        ? 'font-semibold text-red-700'
                        : 'font-semibold text-amber-700'
                  }>
                    {reply.status === 'SENT' ? t.sent : reply.status === 'FAILED' ? t.failed : t.deliveryPending}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{reply.message}</p>
              </li>
            ))}
          </ol>
        </div>
        {error && <p role="alert" className="text-xs leading-5 text-red-700">{error}</p>}
        {notice && <p role="status" className="text-xs leading-5 text-emerald-700">{notice}</p>}
        <div className="flex flex-wrap gap-2">
          {inquiry.status !== 'CLOSED' ? (
            <button
              type="button"
              onClick={() => updateStatus('CLOSED')}
              disabled={isUpdatingStatus}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-500 disabled:opacity-60"
            >
              {isUpdatingStatus ? t.updating : t.markClosed}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => updateStatus('PENDING')}
              disabled={isUpdatingStatus}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#D4AF37]/60 px-3 py-2 text-xs font-semibold text-[#073B2A] transition hover:bg-[#D4AF37]/10 disabled:opacity-60"
            >
              {isUpdatingStatus ? t.updating : t.reopen}
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(inquiry.id)}
              className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              {t.delete}
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-2 border-t border-slate-200 pt-4">
          <label className="block text-xs font-semibold text-[#073B2A]" htmlFor={`inquiry-reply-${inquiry.id}`}>
            {t.sendResponse}
          </label>
          <textarea
            id={`inquiry-reply-${inquiry.id}`}
            required
            maxLength={MAX_REPLY_LENGTH}
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t.writeReply}
            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-5 outline-none placeholder:text-slate-400 focus:border-[#9A7920] focus:ring-2 focus:ring-[#D4AF37]/20"
          />
          <button
            type="submit"
            disabled={isSending || message.trim().length === 0}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#073B2A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0b513a] disabled:cursor-wait disabled:opacity-60"
          >
            {isSending && <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />}
            {isSending ? t.sendingResponse : t.sendResponseButton}
          </button>
        </form>
      </div>
    </details>
  );
}

export function AdminDashboard({ subscribers, inquiries, admin, staff }: AdminDashboardProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<AdminLanguage>('en');
  const [theme, setTheme] = useState<AdminTheme>('light');
  const [activeTab, setActiveTab] = useState<'subscribers' | 'inquiries'>('subscribers');
  const [search, setSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquirySort, setInquirySort] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [subject, setSubject] = useState('');
  const [headline, setHeadline] = useState('');
  const [contentText, setContentText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [campaignResult, setCampaignResult] = useState<CampaignResponse | null>(null);
  const [campaignError, setCampaignError] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'ALL' | ContactInquiryRecord['status']>('ALL');
  const [actionError, setActionError] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const t = COPY[language];
  const isAdmin = admin.role === 'ADMIN';
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('nilorigen-admin-language');
    if (savedLanguage === 'ar' || savedLanguage === 'en') setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const readSavedTheme = (): AdminTheme | null => {
      try {
        const savedTheme = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
        return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
      } catch (error) {
        console.error('Failed to read admin theme preference:', error);
        return null;
      }
    };
    const syncTheme = () => setTheme(readSavedTheme() ?? (systemTheme.matches ? 'dark' : 'light'));
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (!readSavedTheme()) setTheme(event.matches ? 'dark' : 'light');
    };
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ADMIN_THEME_STORAGE_KEY) syncTheme();
    };

    syncTheme();
    systemTheme.addEventListener('change', handleSystemThemeChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      systemTheme.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const changeLanguage = () => {
    const nextLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLanguage);
    window.localStorage.setItem('nilorigen-admin-language', nextLanguage);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error('Failed to save admin theme preference:', error);
    }
  };

  const filteredSubscribers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? subscribers.filter((subscriber) => subscriber.email.toLowerCase().includes(query))
      : subscribers;
  }, [search, subscribers]);

  const pageCount = Math.max(1, Math.ceil(filteredSubscribers.length / PAGE_SIZE));
  const visibleSubscribers = filteredSubscribers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filteredInquiries = useMemo(() => {
    const query = inquirySearch.trim().toLocaleLowerCase(language === 'ar' ? 'ar-EG' : 'en-US');
    return inquiries
      .filter((inquiry) => inquiryStatusFilter === 'ALL' || inquiry.status === inquiryStatusFilter)
      .filter((inquiry) => !query || [
        inquiry.fullName,
        inquiry.company,
        inquiry.email,
        inquiry.destinationCountry,
      ].some((value) => value.toLocaleLowerCase(language === 'ar' ? 'ar-EG' : 'en-US').includes(query)))
      .sort((left, right) => inquirySort === 'newest'
        ? right.createdAt.localeCompare(left.createdAt)
        : left.createdAt.localeCompare(right.createdAt));
  }, [inquiries, inquirySearch, inquirySort, inquiryStatusFilter, language]);

  const pendingCount = inquiries.filter((inquiry) => inquiry.status === 'PENDING').length;
  const completedCount = inquiries.filter((inquiry) => inquiry.status === 'RESPONDED' || inquiry.status === 'CLOSED').length;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleInquiryDelete = async (inquiryId: number) => {
    if (!window.confirm(t.deleteInquiryConfirm)) return;
    setActionError('');
    try {
      const response = await fetch('/api/admin/reply', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryId }),
      });
      if (!response.ok) throw new Error(t.deleteFailed);
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : t.deleteFailed);
    }
  };

  const handleSubscriberDelete = async (subscriberId: number) => {
    if (!window.confirm(t.deleteSubscriberConfirm)) return;
    setActionError('');
    try {
      const response = await fetch(`/api/admin/subscribers/${subscriberId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(t.deleteFailed);
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : t.deleteFailed);
    }
  };

  const exportSubscribersCsv = () => {
    const csvValue = (value: string) => {
      const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const rows = [
      language === 'ar' ? ['البريد الإلكتروني', 'تاريخ الاشتراك'] : ['Email', 'Subscribed At'],
      ...subscribers.map((subscriber) => [subscriber.email, subscriber.createdAt]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvValue).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nilorigen-subscribers.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const createStaffAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError('');
    setIsCreatingStaff(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: staffUsername, password: staffPassword }),
      });
      const result: { success?: boolean } = await response.json();
      if (!response.ok || !result.success) throw new Error(t.userCreateError);
      setStaffUsername('');
      setStaffPassword('');
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : t.userCreateError);
    } finally {
      setIsCreatingStaff(false);
    }
  };

  const setStaffAccountStatus = async (userId: number, isActive: boolean) => {
    if (!window.confirm(isActive ? t.enableStaffConfirm : t.disableStaffConfirm)) return;
    setActionError('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive }),
      });
      if (!response.ok) throw new Error(t.userDisableError);
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : t.userDisableError);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError('');
    if (newPassword !== confirmPassword) {
      setActionError(t.passwordMismatch);
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) throw new Error(t.passwordError);
      setPasswordDialogOpen(false);
      await handleLogout();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : t.passwordError);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (!response.ok) throw new Error(t.logoutFailed);
      router.replace('/admin/login');
      router.refresh();
    } catch {
      setCampaignError(t.logoutError);
      setIsLoggingOut(false);
    }
  };

  const handleCampaignSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCampaignError('');
    setCampaignResult(null);

    if (subscribers.length === 0) {
      setCampaignError(t.noSubscribersCampaign);
      return;
    }

    if (!window.confirm(`${t.confirmCampaign} (${subscribers.length})`)) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, headline, contentText }),
      });
      const result = (await response.json()) as CampaignResponse;

      if (!response.ok || !result.success) {
        setCampaignResult(result);
        throw new Error(t.campaignError);
      }

      setCampaignResult(result);
      setSubject('');
      setHeadline('');
      setContentText('');
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : t.campaignError);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
      data-theme={theme}
      className={`${styles.themeRoot} min-h-screen bg-[#F5F3ED] text-[#17372B]`}
    >
      <header className="border-b border-[#D4AF37]/25 bg-[#073B2A] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="font-english text-xs font-bold tracking-[0.22em] text-[#D4AF37]">NILORIGEN BOTANICALS</p>
            <p className="mt-1 text-xs text-white/60">{t.workspace}</p>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <button type="button" onClick={changeLanguage} className="min-h-10 rounded-lg border border-white/20 px-3 text-xs font-semibold text-[#D4AF37] transition hover:border-[#D4AF37]">
              {t.language}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.switchToLight : t.switchToDark}
              title={theme === 'dark' ? t.switchToLight : t.switchToDark}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 text-[#D4AF37] transition-colors hover:border-[#D4AF37] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#073B2A]"
            >
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: prefersReducedMotion ? 0 : -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: 'easeOut' }}
              >
                {theme === 'dark'
                  ? <Sun aria-hidden="true" className="h-4 w-4" />
                  : <Moon aria-hidden="true" className="h-4 w-4" />}
              </motion.span>
            </button>
            {isAdmin && (
              <button type="button" onClick={() => setPasswordDialogOpen(true)} className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/20 px-3 text-xs font-semibold text-white/85 transition hover:border-[#D4AF37] hover:text-[#D4AF37] sm:inline-flex">
                <Shield aria-hidden="true" className="h-4 w-4" />
                {t.changePassword}
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 px-3 text-xs font-semibold text-white/85 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              {isLoggingOut ? t.signingOut : t.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9A7920]">{t.workspace}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#073B2A] sm:text-4xl">{t.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t.description}</p>
        </div>

        <section aria-label={t.workspace} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{t.totalSubscribers}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-[#073B2A]">{subscribers.length.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                <p className="mt-2 text-xs text-slate-500">{t.subscribersLive}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#073B2A]/[0.07] text-[#9A7920]">
                <Users aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-600">{t.totalInquiries}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#073B2A]">{inquiries.length.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{t.inquiriesTab}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-600">{t.pendingInquiries}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-amber-700">{pendingCount.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{t.pending}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-600">{t.closedCompleted}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-emerald-800">{completedCount.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{t.responded} · {t.closed}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D4AF37]/25 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#073B2A]/[0.07] text-[#9A7920]">
              <Mail aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#073B2A]">{t.composeCampaign}</h2>
              <p className="mt-1 text-sm text-slate-600">{t.campaignDescription}</p>
            </div>
          </div>

          <form onSubmit={handleCampaignSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              {t.emailSubject}
              <input
                required
                maxLength={200}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm outline-none transition focus:border-[#9A7920] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t.headline}
              <input
                required
                maxLength={200}
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm outline-none transition focus:border-[#9A7920] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t.messageBody}
              <textarea
                required
                maxLength={20000}
                rows={7}
                value={contentText}
                onChange={(event) => setContentText(event.target.value)}
                placeholder={t.campaignPlaceholder}
                className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#9A7920] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </label>

            {campaignError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{campaignError}</p>}
            {campaignResult && (
              <div role="status" className="rounded-lg border border-[#D4AF37]/35 bg-[#D4AF37]/[0.08] px-4 py-3 text-sm text-[#17372B]">
                <p className="font-semibold">
                  {campaignResult.totalSent ?? 0} / {campaignResult.totalSubscribers ?? subscribers.length} {t.accepted}
                </p>
                {(campaignResult.failedCount ?? 0) > 0 && (
                  <p className="mt-1 text-xs text-slate-600">{campaignResult.failedCount} {t.failedEmails}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSending || subscribers.length === 0}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-5 text-sm font-bold text-[#073B2A] shadow-sm transition hover:bg-[#e2c35d] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
            >
              {isSending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ArrowUpRight aria-hidden="true" className="h-4 w-4" />}
              {isSending ? t.sendingCampaign : t.sendCampaign}
            </button>
          </form>
        </section>

        {isAdmin && (
          <section aria-labelledby="admin-settings-heading" className="rounded-2xl border border-[#D4AF37]/25 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 id="admin-settings-heading" className="text-lg font-semibold text-[#073B2A]">{t.adminSettings}</h2>
                <p className="mt-1 text-sm text-slate-600">{t.staffDescription}</p>
              </div>
              <button type="button" onClick={() => setPasswordDialogOpen(true)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/60 px-3 text-xs font-semibold text-[#073B2A] transition hover:bg-[#D4AF37]/10">
                <Shield aria-hidden="true" className="h-4 w-4" />{t.changePassword}
              </button>
            </div>
            <form onSubmit={createStaffAccount} className="grid gap-3 border-b border-slate-100 pb-6 sm:grid-cols-[1fr_1fr_auto]">
              <label className="block text-xs font-semibold text-slate-600">{t.username}
                <input required minLength={3} maxLength={64} pattern="([a-zA-Z0-9._]|-){3,64}" value={staffUsername} onChange={(event) => setStaffUsername(event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#9A7920]" />
              </label>
              <label className="block text-xs font-semibold text-slate-600">{t.password}
                <input required type="password" minLength={12} maxLength={72} value={staffPassword} onChange={(event) => setStaffPassword(event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#9A7920]" />
              </label>
              <button type="submit" disabled={isCreatingStaff} className="min-h-10 self-end rounded-lg bg-[#073B2A] px-4 text-sm font-semibold text-white transition hover:bg-[#0b513b] disabled:opacity-60">
                {isCreatingStaff ? t.creatingStaff : t.createStaff}
              </button>
              <p className="text-xs text-slate-500 sm:col-span-3">{t.passwordRequirements}</p>
            </form>
            {actionError && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</p>}
            <div className="mt-5 space-y-2">
              {staff.filter((user) => user.role === 'STAFF').map((user) => (
                <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#17372B]">{user.username}</p>
                    <p className={`mt-0.5 text-xs ${user.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>{user.isActive ? t.active : t.disabled}</p>
                  </div>
                  <button type="button" onClick={() => setStaffAccountStatus(user.id, !user.isActive)} className={`min-h-9 rounded-lg border px-3 text-xs font-semibold ${user.isActive ? 'border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-700' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
                    {user.isActive ? t.disable : t.enable}
                  </button>
                </div>
              ))}
              {staff.filter((user) => user.role === 'STAFF').length === 0 && <p className="text-sm text-slate-500">{t.noStaff}</p>}
            </div>
          </section>
        )}

        {passwordDialogOpen && isAdmin && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPasswordDialogOpen(false); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="change-password-heading" className="w-full max-w-lg rounded-2xl border border-[#D4AF37]/40 bg-white p-5 shadow-2xl sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 id="change-password-heading" className="text-lg font-semibold text-[#073B2A]">{t.changePassword}</h2>
                <button type="button" aria-label={t.closeDialog} onClick={() => setPasswordDialogOpen(false)} className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">{t.closeDialog}</button>
              </div>
              <form onSubmit={updatePassword} className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">{t.currentPassword}<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#9A7920]" /></label>
                <label className="block text-sm font-medium text-slate-700">{t.newPassword}<input required type="password" minLength={12} maxLength={72} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#9A7920]" /></label>
                <label className="block text-sm font-medium text-slate-700">{t.confirmPassword}<input required type="password" minLength={12} maxLength={72} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#9A7920]" /></label>
                <p className="text-xs text-slate-500">{t.passwordRequirements}</p>
                {actionError && <p role="alert" className="text-sm text-red-700">{actionError}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setPasswordDialogOpen(false)} className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600">{t.closeDialog}</button>
                  <button type="submit" disabled={isUpdatingPassword} className="min-h-10 rounded-lg bg-[#D4AF37] px-4 text-sm font-bold text-[#073B2A] disabled:opacity-60">{isUpdatingPassword ? t.savingPassword : t.savePassword}</button>
                </div>
              </form>
            </section>
          </div>
        )}

        <section aria-label={t.contactRecords} className="overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 pt-4 sm:px-6 sm:pt-5">
            <div aria-label={t.contactRecordType} className="flex gap-2 overflow-x-auto">
              <button
                type="button"
                aria-pressed={activeTab === 'subscribers'}
                onClick={() => setActiveTab('subscribers')}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors sm:px-4 ${
                  activeTab === 'subscribers'
                    ? 'border-[#D4AF37] text-[#073B2A]'
                    : 'border-transparent text-slate-500 hover:text-[#073B2A]'
                }`}
              >
                <Users aria-hidden="true" className="h-4 w-4" />
                {t.subscribersTab}
                <span className="rounded-full bg-[#073B2A]/[0.07] px-2 py-0.5 text-xs text-[#073B2A]">
                  {subscribers.length.toLocaleString('en-US')}
                </span>
              </button>
              <button
                type="button"
                aria-pressed={activeTab === 'inquiries'}
                onClick={() => setActiveTab('inquiries')}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors sm:px-4 ${
                  activeTab === 'inquiries'
                    ? 'border-[#D4AF37] text-[#073B2A]'
                    : 'border-transparent text-slate-500 hover:text-[#073B2A]'
                }`}
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                {t.exportInquiries}
                <span className="rounded-full bg-[#073B2A]/[0.07] px-2 py-0.5 text-xs text-[#073B2A]">
                  {inquiries.length.toLocaleString('en-US')}
                </span>
              </button>
            </div>
          </div>

          {activeTab === 'subscribers' ? (
            <div>
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-[#073B2A]">{t.subscriberList}</h2>
              <p className="mt-1 text-xs text-slate-500">{filteredSubscribers.length.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {t.matchingRecords}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block w-full sm:max-w-xs">
                <Search aria-hidden="true" className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => handleSearch(event.target.value)}
                  placeholder={t.searchSubscribers}
                  className="min-h-10 w-full rounded-lg border border-slate-200 ps-9 pe-3 text-sm outline-none focus:border-[#9A7920] focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </label>
              <button type="button" onClick={exportSubscribersCsv} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/60 px-3 text-xs font-semibold text-[#073B2A] transition hover:bg-[#D4AF37]/10">
                <Download aria-hidden="true" className="h-4 w-4" />{t.exportCsv}
              </button>
            </div>
          </div>
          {actionError && <p role="alert" className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-6">{actionError}</p>}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-start text-sm">
              <thead className="bg-[#F8F7F2] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold sm:px-6">{t.emailCol}</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold sm:px-6">{t.subscribedCol}</th>
                  {isAdmin && <th scope="col" className="px-5 py-3.5 font-semibold sm:px-6">{t.delete}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="transition hover:bg-[#F8F7F2]/70">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-[#17372B] sm:px-6">{subscriber.email}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600 sm:px-6">
                      <FormattedDate value={subscriber.createdAt} language={language} />
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => handleSubscriberDelete(subscriber.id)} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50">
                          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />{t.delete}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {visibleSubscribers.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 3 : 2} className="px-5 py-12 text-center text-sm text-slate-500">
                      <CheckCircle2 aria-hidden="true" className="mx-auto mb-2 h-5 w-5 text-slate-300" />
                      {search ? t.noSearchSubscribers : t.noSubscribers}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>{t.page} {page} / {pageCount}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="min-h-9 rounded-md border border-slate-200 px-3 font-medium transition hover:border-[#9A7920] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t.previous}
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                disabled={page === pageCount}
                className="min-h-9 rounded-md border border-slate-200 px-3 font-medium transition hover:border-[#9A7920] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t.next}
              </button>
            </div>
          </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-1 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#073B2A]">{t.inquiriesTab}</h2>
                  <p className="mt-1 text-xs text-slate-500">{t.inquiriesNewest}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="inline-flex w-fit items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/[0.10] px-3 py-1 text-xs font-semibold text-[#073B2A]">
                    {inquiries.length.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {t.totalInquiryCount}
                  </span>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Search aria-hidden="true" className="h-4 w-4" />
                    <input type="search" value={inquirySearch} onChange={(event) => setInquirySearch(event.target.value)} placeholder={t.searchInquiries} className="min-h-9 min-w-0 rounded-lg border border-slate-200 px-2.5 text-xs outline-none focus:border-[#9A7920] sm:w-64" />
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    {t.filterStatus}
                    <select
                      value={inquiryStatusFilter}
                      onChange={(event) => setInquiryStatusFilter(event.target.value as typeof inquiryStatusFilter)}
                      className="min-h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-[#17372B] outline-none focus:border-[#9A7920] focus:ring-2 focus:ring-[#D4AF37]/20"
                    >
                      <option value="ALL">{t.allStatuses}</option>
                      <option value="PENDING">{t.pending}</option>
                      <option value="RESPONDED">{t.responded}</option>
                      <option value="CLOSED">{t.closed}</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    {t.sortBy}
                    <select value={inquirySort} onChange={(event) => setInquirySort(event.target.value as typeof inquirySort)} className="min-h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs">
                      <option value="newest">{t.newest}</option>
                      <option value="oldest">{t.oldest}</option>
                    </select>
                  </label>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="px-5 py-14 text-center text-sm text-slate-500 sm:px-6">
                  <CheckCircle2 aria-hidden="true" className="mx-auto mb-2 h-5 w-5 text-slate-300" />
                  {t.noInquiries}
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="px-5 py-14 text-center text-sm text-slate-500 sm:px-6">
                  {t.noStatusMatches}
                </div>
              ) : (
                <>
                  <div className="divide-y divide-slate-100 lg:hidden">
                    {filteredInquiries.map((inquiry) => (
                      <article key={inquiry.id} className="space-y-4 p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-[#073B2A]">{inquiry.fullName}</h3>
                            <p className="text-sm text-slate-600">{inquiry.company}</p>
                          </div>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${inquiryStatusClass(inquiry.status)}`}>
                            {inquiryStatusLabel(inquiry.status, language)}
                          </span>
                        </div>
                        <a href={`mailto:${inquiry.email}`} dir="ltr" className="break-all text-start text-sm font-medium text-[#806314] hover:underline">
                          {inquiry.email}
                        </a>
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.destinationCountry}</p>
                            <p className="mt-1 text-[#17372B]">{inquiry.destinationCountry}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.submittedOn}</p>
                            <FormattedDate value={inquiry.createdAt} className="mt-1 block text-[#17372B]" language={language} />
                          </div>
                        </div>
                        <InquiryDetail inquiry={inquiry} language={language} canDelete={isAdmin} onDelete={handleInquiryDelete} />
                      </article>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[1200px] text-start text-sm">
                      <thead className="bg-[#F8F7F2] text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th scope="col" className="px-5 py-3.5 font-semibold">{t.contact}</th>
                          <th scope="col" className="px-5 py-3.5 font-semibold">{t.corporateEmail}</th>
                          <th scope="col" className="px-5 py-3.5 font-semibold">{t.destination}</th>
                          <th scope="col" className="px-5 py-3.5 font-semibold">{t.specifications}</th>
                          <th scope="col" className="px-5 py-3.5 font-semibold">{t.submitted}</th>
                          <th scope="col" className="px-5 py-3.5 font-semibold">{t.status}</th>
                          <th scope="col" className="min-w-[240px] px-5 py-3.5 font-semibold">{t.replyColumn}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="align-top transition hover:bg-[#F8F7F2]/70">
                            <td className="max-w-[200px] px-5 py-4">
                              <p className="font-semibold text-[#17372B]">{inquiry.fullName}</p>
                              <p className="mt-1 break-words text-xs text-slate-500">{inquiry.company}</p>
                            </td>
                            <td className="px-5 py-4">
                              <a href={`mailto:${inquiry.email}`} dir="ltr" className="break-all text-start font-medium text-[#806314] hover:underline">
                                {inquiry.email}
                              </a>
                            </td>
                            <td className="px-5 py-4 text-[#17372B]">{inquiry.destinationCountry}</td>
                            <td className="max-w-sm whitespace-pre-wrap break-words px-5 py-4 leading-6 text-slate-600">
                              {inquiry.specifications}
                            </td>
                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                              <FormattedDate value={inquiry.createdAt} language={language} />
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${inquiryStatusClass(inquiry.status)}`}>
                                {inquiryStatusLabel(inquiry.status, language)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <InquiryDetail inquiry={inquiry} language={language} canDelete={isAdmin} onDelete={handleInquiryDelete} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
