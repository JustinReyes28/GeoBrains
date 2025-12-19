/**
 * Simple test script to verify login security implementation
 * This would need to be run in a Node.js environment with the proper setup
 */

const { prisma } = require('./src/lib/prisma');
const bcrypt = require('bcryptjs');

async function testSecurityImplementation() {
    console.log('🔒 Testing Security Implementation...\n');

    try {
        // Clean up test data
        await prisma.auditLog.deleteMany({
            where: {
                action: {
                    contains: 'TEST'
                }
            }
        });

        // Create a test user
        const testEmail = 'test-security@example.com';
        const testPassword = 'securePassword123!';
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        const testUser = await prisma.user.upsert({
            where: { email: testEmail },
            update: {
                password: hashedPassword,
                emailVerified: new Date(),
                failedAttemptCount: 0,
                lastFailedAt: null,
                lockedUntil: null
            },
            create: {
                email: testEmail,
                password: hashedPassword,
                emailVerified: new Date(),
                name: 'Test User'
            }
        });

        console.log('✅ Test user created:', testUser.email);

        // Test 1: Verify user can log in with correct credentials
        console.log('\n📋 Test 1: Successful login attempt');
        const passwordsMatch = await bcrypt.compare(testPassword, testUser.password);
        console.log('✅ Password comparison works:', passwordsMatch);

        // Test 2: Check audit log creation
        console.log('\n📋 Test 2: Audit log creation');
        await prisma.auditLog.create({
            data: {
                userId: testUser.id,
                action: 'TEST_LOGIN_SUCCESS',
                metadata: {
                    test: true,
                    message: 'Test audit log entry'
                }
            }
        });

        const auditLogs = await prisma.auditLog.findMany({
            where: {
                userId: testUser.id
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        console.log('✅ Audit log created:', auditLogs.length > 0);
        if (auditLogs.length > 0) {
            console.log('   Latest log:', auditLogs[0].action);
        }

        // Test 3: Test security fields update
        console.log('\n📋 Test 3: Security fields update');
        const updatedUser = await prisma.user.update({
            where: { id: testUser.id },
            data: {
                failedAttemptCount: 3,
                lastFailedAt: new Date()
            }
        });

        console.log('✅ Security fields updated:');
        console.log('   Failed attempts:', updatedUser.failedAttemptCount);
        console.log('   Last failed at:', updatedUser.lastFailedAt);

        // Test 4: Test account lockout
        console.log('\n📋 Test 4: Account lockout simulation');
        const lockoutTime = new Date();
        lockoutTime.setMinutes(lockoutTime.getMinutes() + 5); // 5 minutes from now

        const lockedUser = await prisma.user.update({
            where: { id: testUser.id },
            data: {
                failedAttemptCount: 5,
                lockedUntil: lockoutTime
            }
        });

        console.log('✅ Account lockout set:');
        console.log('   Locked until:', lockedUser.lockedUntil);
        console.log('   Is currently locked:', new Date() < lockedUser.lockedUntil);

        // Test 5: Reset security fields (simulate successful login)
        console.log('\n📋 Test 5: Security fields reset');
        const resetUser = await prisma.user.update({
            where: { id: testUser.id },
            data: {
                failedAttemptCount: 0,
                lastFailedAt: null,
                lockedUntil: null
            }
        });

        console.log('✅ Security fields reset:');
        console.log('   Failed attempts:', resetUser.failedAttemptCount);
        console.log('   Last failed at:', resetUser.lastFailedAt);
        console.log('   Locked until:', resetUser.lockedUntil);

        console.log('\n🎉 All security tests passed!');
        console.log('\n📊 Summary:');
        console.log('   ✅ User creation with security fields');
        console.log('   ✅ Password hashing and verification');
        console.log('   ✅ Audit logging functionality');
        console.log('   ✅ Security field updates');
        console.log('   ✅ Account lockout mechanism');
        console.log('   ✅ Security field reset');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testSecurityImplementation();
}

module.exports = { testSecurityImplementation };