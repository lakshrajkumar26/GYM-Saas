-- CreateTable
CREATE TABLE "GymSettings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'B Gym International',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymSettings_pkey" PRIMARY KEY ("id")
);

-- Insert default settings
INSERT INTO "GymSettings" (id, name, address, phone, email, description, "updatedAt")
VALUES (
    gen_random_uuid(),
    'B Gym International',
    'Your Gym Address Here',
    '+91-7903906436',
    'info@bgym.com',
    'Transform your body, transform your life',
    NOW()
);
