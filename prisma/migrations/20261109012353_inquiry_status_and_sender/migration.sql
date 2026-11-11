-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactInquiry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "specifications" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);
INSERT INTO "new_ContactInquiry" ("company", "createdAt", "destinationCountry", "email", "fullName", "id", "specifications") SELECT "company", "createdAt", "destinationCountry", "email", "fullName", "id", "specifications" FROM "ContactInquiry";
DROP TABLE "ContactInquiry";
ALTER TABLE "new_ContactInquiry" RENAME TO "ContactInquiry";
CREATE TABLE "new_InquiryReply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inquiryId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL DEFAULT 'export@nilorigen.com',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" DATETIME,
    CONSTRAINT "InquiryReply_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "ContactInquiry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InquiryReply" ("createdAt", "id", "inquiryId", "message", "sentAt", "status") SELECT "createdAt", "id", "inquiryId", "message", "sentAt", "status" FROM "InquiryReply";
DROP TABLE "InquiryReply";
ALTER TABLE "new_InquiryReply" RENAME TO "InquiryReply";
CREATE INDEX "InquiryReply_inquiryId_createdAt_idx" ON "InquiryReply"("inquiryId", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
