import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { FileCleanupService } from '../src/file/file-cleanup.service';

async function testCleanup() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fileCleanupService = app.get(FileCleanupService);

  console.log('=== Testing the image cleanup system ===\n');

  try {
    console.log('📊 Stats before cleanup:');
    const statsBefore = await fileCleanupService.getCleanupStats();
    console.log(JSON.stringify(statsBefore, null, 2));

    if (statsBefore.unusedFiles > 0) {
      console.log('\n🧹 Starting manual cleanup...');
      await fileCleanupService.manualCleanup();

      console.log('\n📊 Stats after cleanup:');
      const statsAfter = await fileCleanupService.getCleanupStats();
      console.log(JSON.stringify(statsAfter, null, 2));
    } else {
      console.log('\n✅ No unused files found!');
    }
  } catch (error) {
    console.error('❌ Testing error:', error);
  }

  await app.close();
}

void testCleanup();
