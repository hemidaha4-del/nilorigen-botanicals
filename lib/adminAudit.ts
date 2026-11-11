import type { AdminUser } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type AuditWriter = Pick<Prisma.TransactionClient, 'adminAuditLog'>;
type AuditActor = Pick<AdminUser, 'id' | 'username'>;

interface AdminAuditEntry {
  action: string;
  targetType: string;
  targetId?: string | number;
  details?: string;
}

export async function recordAdminAudit(
  actor: AuditActor,
  entry: AdminAuditEntry,
  writer: AuditWriter = prisma
): Promise<void> {
  await writer.adminAuditLog.create({
    data: {
      actorId: actor.id,
      actorUsername: actor.username,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId === undefined ? null : String(entry.targetId),
      details: entry.details ?? null,
    },
  });
}
