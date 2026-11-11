import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminDashboard, type AdminUserRecord, type ContactInquiryRecord, type SubscriberRecord } from './AdminDashboard';
import { getAuthenticatedAdminFromToken } from '@/lib/adminSecurity';
import { SESSION_COOKIE_NAME } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

function normalizeInquiryStatus(status: string): ContactInquiryRecord['status'] {
  if (status === 'RESPONDED' || status === 'CLOSED') return status;
  return 'PENDING';
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const admin = await getAuthenticatedAdminFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!admin) redirect('/admin/login');

  const [subscribers, inquiries, staff] = await Promise.all([
    prisma.subscriber.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    }),
    prisma.contactInquiry.findMany({
    include: {
      replies: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    }),
    admin.role === 'ADMIN'
      ? prisma.adminUser.findMany({
          select: { id: true, username: true, role: true, isActive: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        })
      : Promise.resolve([]),
  ]);

  const subscriberRecords: SubscriberRecord[] = subscribers.map((subscriber) => ({
    id: subscriber.id,
    email: subscriber.email,
    createdAt: subscriber.createdAt.toISOString(),
  }));
  const inquiryRecords: ContactInquiryRecord[] = inquiries.map((inquiry) => ({
    id: inquiry.id,
    fullName: inquiry.fullName,
    company: inquiry.company,
    email: inquiry.email,
    destinationCountry: inquiry.destinationCountry,
    specifications: inquiry.specifications,
    createdAt: inquiry.createdAt.toISOString(),
    status: normalizeInquiryStatus(inquiry.status),
    replies: inquiry.replies.map((reply) => ({
      id: reply.id,
      message: reply.message,
      status: reply.status,
      senderEmail: reply.senderEmail,
      createdAt: reply.createdAt.toISOString(),
      sentAt: reply.sentAt?.toISOString() ?? null,
    })),
  }));
  const staffRecords: AdminUserRecord[] = staff.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  }));

  return (
    <AdminDashboard
      subscribers={subscriberRecords}
      inquiries={inquiryRecords}
      admin={{ id: admin.id, username: admin.username, role: admin.role }}
      staff={staffRecords}
    />
  );
}
