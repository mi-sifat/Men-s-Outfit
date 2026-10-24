import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import readline from 'readline';
import { User } from '../models/User';
import { UserRole } from '../types';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/echo-outfits';

  console.log('\n======================================================');
  console.log('   ECHO OUTFITS — SECURE ADMIN CREATION UTILITY       ');
  console.log('======================================================\n');
  console.log(`Connecting to database: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully.\n');

    const email = (await askQuestion('Enter Admin Email Address: ')).trim().toLowerCase();
    if (!email || !email.includes('@')) {
      console.error('❌ Error: A valid email address is required.');
      process.exit(1);
    }

    const name = (await askQuestion('Enter Admin Full Name: ')).trim() || 'Store Administrator';
    const phone = (await askQuestion('Enter Admin Phone (Optional, e.g. 01700000000): ')).trim();
    const password = (await askQuestion('Enter Secure Password (min 8 chars): ')).trim();

    if (!password || password.length < 8) {
      console.error('❌ Error: Password must be at least 8 characters long.');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️ User with email "${email}" already exists.`);
      const answer = await askQuestion('Do you want to promote this user to OWNER/ADMIN and update password? (y/N): ');
      if (answer.toLowerCase() === 'y') {
        existingUser.password = password;
        existingUser.role = UserRole.OWNER;
        existingUser.isActive = true;
        if (name) existingUser.name = name;
        if (phone) existingUser.phone = phone;
        await existingUser.save();
        console.log(`\n🎉 User "${email}" successfully updated to OWNER role with new password!`);
      } else {
        console.log('Operation cancelled.');
      }
    } else {
      const admin = await User.create({
        name,
        email,
        phone: phone || undefined,
        password,
        role: UserRole.OWNER,
        isActive: true,
      });

      console.log(`\n🎉 Admin user "${admin.email}" successfully created with role: OWNER`);
    }

    console.log('\nYou can now log in using the Admin login endpoint or Admin panel.');
  } catch (err: any) {
    console.error('❌ Failed to create admin user:', err.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
