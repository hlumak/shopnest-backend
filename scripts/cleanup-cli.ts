import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { INestApplicationContext } from '@nestjs/common';
import { FileCleanupService } from '../src/file/file-cleanup.service';

async function createApp(): Promise<INestApplicationContext> {
  return await NestFactory.createApplicationContext(AppModule);
}

async function checkStats() {
  console.log('🔍 Checking image cleanup statistics...\n');

  const app = await createApp();
  const fileCleanupService = app.get(FileCleanupService);

  try {
    const stats = await fileCleanupService.getCleanupStats();

    console.log('📊 Current statistics:');
    console.log(`- Total files: ${stats.totalFiles}`);
    console.log(`- Used files: ${stats.usedFiles}`);
    console.log(`- Unused files: ${stats.unusedFiles}`);

    if (stats.unusedFiles > 0) {
      console.log('\n🗑️ Unused files:');
      stats.unusedFilesList?.forEach(file => {
        console.log(`  - ${file}`);
      });
      console.log('\n💡 To clean up, run: npm run cleanup');
    } else {
      console.log('\n✅ All files are used, no cleanup required!');
    }
  } catch (error) {
    console.error('❌ Error while getting statistics:', error);
  }

  await app.close();
}

async function runCleanup() {
  console.log('🧹 Starting cleanup of unused images...\n');

  const app = await createApp();
  const fileCleanupService = app.get(FileCleanupService);

  try {
    await fileCleanupService.manualCleanup();
    console.log('\n✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }

  await app.close();
}

const command = process.argv[2];

switch (command) {
  case 'stats':
    void checkStats();
    break;
  case 'clean':
    void runCleanup();
    break;
  default:
    console.log('Available commands:');
    console.log('  npm run cleanup:stats  - show statistics');
    console.log('  npm run cleanup:clean  - start cleanup');
    process.exit(1);
}
