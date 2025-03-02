-- AlterTable
ALTER TABLE "_ChatToMessage" ADD CONSTRAINT "_ChatToMessage_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ChatToMessage_AB_unique";

-- AlterTable
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserFollows_AB_unique";
