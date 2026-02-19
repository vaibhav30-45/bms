# 🗄️ Standard Operating Procedure (SOP)
## PostgreSQL Database Setup - Local Development Environment

**For:** Backend Engineers Only  
**Repository:** https://github.com/AnishJaiswal4444/bank-management-system  
**Version:** 1.0  
**Created by:** Anish Jaiswal (Project Lead)  
**Last Updated:** February 15, 2026

---

## 🎯 Purpose

This SOP guides backend engineers through setting up PostgreSQL database on their local machine for development. Each backend engineer will have their own independent database instance.

**Who needs this:**
- ✅ All Backend Engineers (You, Vansh, Khushboo)

**Who doesn't need this:**
- ❌ Frontend Engineers (They connect to backend APIs, not database)

---

## ⏱️ Estimated Time

- **First-time setup:** 30 minutes
- **Already have PostgreSQL:** 5 minutes (just create database)

---

## 📋 Prerequisites

Before starting, ensure you have:
- Windows 10/11 (for this guide)
- Administrator access on your computer
- At least 500 MB free disk space
- Internet connection for download

---

## 🚀 Installation Steps

---

### STEP 1: Download PostgreSQL

**1.1 Go to Official Website**

Open browser and navigate to:
https://www.postgresql.org/download/windows/

**1.2 Download Installer**

- Click on "Download the installer"
- You'll be redirected to EnterpriseDB (EDB) website
- Select the latest version (PostgreSQL 15 or 16)
- Choose "Windows x86-64" for 64-bit Windows
- Click Download
- File will be named something like: postgresql-15.x-windows-x64.exe
- Save it to your Downloads folder

**Expected file size:** Around 250-300 MB

---

### STEP 2: Install PostgreSQL

**2.1 Run the Installer**

- Locate the downloaded .exe file in Downloads
- Right-click → Run as Administrator
- If User Account Control prompt appears, click "Yes"

**2.2 Setup Wizard - Welcome Screen**

- Click "Next"

**2.3 Installation Directory**

- Default path: C:\Program Files\PostgreSQL\15
- **Don't change this** unless you have a specific reason
- Click "Next"

**2.4 Select Components**

Make sure these are checked:
- ✅ PostgreSQL Server (required)
- ✅ pgAdmin 4 (GUI tool - very important!)
- ✅ Stack Builder (optional - you can uncheck this)
- ✅ Command Line Tools (required)

Click "Next"

**2.5 Data Directory**

- Default: C:\Program Files\PostgreSQL\15\data
- **Don't change this**
- Click "Next"

**2.6 Password**

⚠️ **VERY IMPORTANT - EVERYONE USE THE SAME PASSWORD**

This makes team collaboration easier and avoids confusion.

**Standard Password for Our Team:**
- Password: admin123
- Confirm Password: admin123

**Write this down or save in your password manager!**

Click "Next"

**2.7 Port**

- Default: 5432
- **Don't change this**
- Click "Next"

**2.8 Advanced Options**

- Locale: Default locale
- **Don't change this**
- Click "Next"

**2.9 Pre Installation Summary**

- Review the settings
- Click "Next"

**2.10 Ready to Install**

- Click "Next"
- Wait for installation to complete (takes 2-5 minutes)
- Progress bar will show installation status

**2.11 Completing Setup**

- **Uncheck** "Launch Stack Builder at exit" (we don't need it)
- Click "Finish"

✅ **PostgreSQL is now installed!**

---

### STEP 3: Verify Installation

**3.1 Check PostgreSQL Service**

Windows + R → Type: services.msc → Press Enter

In the Services window:
- Scroll down to find: **postgresql-x64-15** (or 16)
- Status column should show: **Running**
- Startup Type should show: **Automatic**

If status is NOT "Running":
- Right-click on the service
- Click "Start"
- Wait a few seconds
- Status should change to "Running"

**3.2 Test Command Line**

Open Command Prompt (Windows + R → cmd → Enter)

Type and press Enter:
psql --version

Expected output:
psql (PostgreSQL) 15.x

If you see this, PostgreSQL is installed correctly! ✅

If you get "command not found":
- Close and reopen Command Prompt
- Try again
- If still not working, restart your computer

---

### STEP 4: Configure pgAdmin 4

**4.1 Open pgAdmin 4**

- Open Start Menu
- Search for "pgAdmin 4"
- Click to open
- Browser window will open (pgAdmin runs in browser)

**4.2 Set Master Password (First Time Only)**

pgAdmin will ask for a Master Password:
- This is **different** from the postgres password
- This protects your pgAdmin configuration
- You can use: pgadmin123
- Click "OK"

Note: This password is only for pgAdmin interface, not for database access.

**4.3 Connect to PostgreSQL Server**

In pgAdmin interface:
- Left sidebar shows "Servers"
- Expand "Servers" (click the arrow)
- Click on "PostgreSQL 15" (or 16)
- Dialog box will appear asking for password

Enter password: admin123 (the one you set during installation)

Check "Save Password" checkbox

Click "OK"

If connection successful:
- PostgreSQL 15 will expand
- You'll see "Databases (2)" or similar
- This means connection is working! ✅

If connection fails:
- Double-check password
- Ensure PostgreSQL service is running (check services.msc)
- Try again

---

### STEP 5: Create Project Database

**5.1 Create Database**

In pgAdmin:
- Expand "Servers" → "PostgreSQL 15"
- Right-click on "Databases"
- Hover over "Create"
- Click "Database..."

**5.2 Database Details**

In the "Create - Database" dialog:

**General Tab:**
- Database: bank_management
- Owner: postgres
- Comment: (leave empty or add: "Bank Management System Development DB")

**Definition Tab:**
- Encoding: UTF8 (default)
- Template: template1 (default)
- Leave other fields as default

Click "Save"

You should now see "bank_management" in the Databases list! ✅

**5.3 Create Application User**

Security best practice: Don't use the postgres superuser in the application.

In pgAdmin:
- Expand "PostgreSQL 15"
- Right-click on "Login/Group Roles"
- Hover over "Create"
- Click "Login/Group Role..."

**General Tab:**
- Name: bank_user

**Definition Tab:**
- Password: bank123
- Password expiration: (leave empty)

**Privileges Tab:**
Check these boxes:
- ✅ Can login?
- ✅ Create databases?
- Leave others unchecked

Click "Save"

**5.4 Grant Privileges to User**

Right-click on "bank_management" database → "Properties"

Go to "Security" tab

Click the "+" button to add privileges

In the "Privileges" section:
- Grantee: bank_user
- Privileges: Check ALL boxes (SELECT, INSERT, UPDATE, DELETE, etc.)
- Or simply toggle "ALL" privilege

Click "Save"
### **5.5 Grant Schema Privileges to User** ⭐ **IMPORTANT STEP**

This step allows `bank_user` to create tables in the database.

**Using pgAdmin UI:**

1. Expand "bank_management" database
2. Expand "Schemas"
3. Right-click on "public" schema
4. Click "Properties"
5. Go to "Security" tab
6. Click the "+" button
7. In the new row:
   - **Grantee:** bank_user
   - **Privileges:** Check **ALL** boxes:
      - ✅ USAGE
      - ✅ CREATE
      - ✅ ALL
8. Click "Save"

**Alternative: Using Query Tool (Faster)**

Right-click on "bank_management" database → "Query Tool"

Run these commands:
```sql
-- Grant schema permissions
GRANT ALL ON SCHEMA public TO bank_user;

-- Grant permissions on future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bank_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bank_user;
```

Click the "Play" button (▶) or press F5

✅ **Database and user are now fully configured!**

---

### STEP 6: Test Database Connection

**6.1 Open Query Tool**

In pgAdmin:
- Right-click on "bank_management" database
- Click "Query Tool"

A new panel will open where you can write SQL.

**6.2 Run Test Query**

In the Query Tool, type:

SELECT version();

Click the "Play" button (▶) or press F5

Expected result:
You should see PostgreSQL version information in the output panel.

Example output:
PostgreSQL 15.3, compiled by Visual C++ build 1914, 64-bit

If you see this, **database is working correctly!** ✅

**6.3 Test User Permissions**

Run this query:

CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

If this executes without errors, permissions are correct! ✅

Clean up the test table:

DROP TABLE test_table;

---

### STEP 7: Pull Latest Code

**7.1 Get Updated Code from Repository**

The application.properties file has already been configured by Anish (Project Lead) with the correct database settings.

Simply pull the latest code:

git checkout develop
git pull origin develop

The database configuration is already set to:
- Database: bank_management
- User: bank_user
- Password: bank123
- Port: 5432

No changes needed in application.properties - it's ready to use! ✅

---

### STEP 8: Test Application Connection

**8.1 Build the Project**

Open terminal in IntelliJ (or Command Prompt in project root)

mvn clean install

Expected output:
[INFO] BUILD SUCCESS

If you get errors, check:
- Maven is installed
- Java 17 is installed
- pom.xml is valid

**8.2 Run the Application**

mvn spring-boot:run

Expected output in logs:
- "Started BankManagementSystemApplication in X seconds"
- You should see Hibernate DDL statements (CREATE TABLE...)
- No error messages

**8.3 Verify Tables Created**

Go back to pgAdmin:
- Refresh "bank_management" database (right-click → Refresh)
- Expand "bank_management" → "Schemas" → "public" → "Tables"

You should see tables like:
- users
- branches
- accounts
- savings_accounts
- current_accounts
- transactions
- kyc_documents
- addresses
- beneficiaries
- etc.

If you see these tables, **EVERYTHING IS WORKING!** 🎉

---

## ✅ Verification Checklist

Before marking setup as complete, verify:

□ PostgreSQL service is running (check services.msc)
□ pgAdmin 4 opens and connects successfully
□ Database "bank_management" exists
□ User "bank_user" created with password "bank123"
□ Test query runs successfully in Query Tool
□ application.properties configured correctly
□ mvn clean install → BUILD SUCCESS
□ mvn spring-boot:run → Application starts without errors
□ Tables auto-created in database
□ Can see tables in pgAdmin

---

## 🚨 Troubleshooting

### Issue 1: PostgreSQL service won't start

**Symptoms:**
- Service shows "Stopped" in services.msc
- Can't start manually

**Solutions:**
1. Check if port 5432 is already in use by another application
2. Restart computer and try again
3. Reinstall PostgreSQL
4. Check Windows Event Viewer for error details

---

### Issue 2: Can't connect in pgAdmin

**Symptoms:**
- "Could not connect to server" error
- Connection timeout

**Solutions:**
1. Verify PostgreSQL service is running
2. Double-check password (case-sensitive!)
3. Try connecting as user "postgres" instead
4. Check firewall settings (allow port 5432)
5. Restart PostgreSQL service

---

### Issue 3: Password authentication failed

**Symptoms:**
- "password authentication failed for user"

**Solutions:**
1. Make sure you're using the correct password: admin123
2. Reset password using SQL Shell:
   - Open SQL Shell (psql)
   - Login as postgres
   - Run: ALTER USER postgres PASSWORD 'admin123';
3. For bank_user, run: ALTER USER bank_user PASSWORD 'bank123';

---

### Issue 4: Application can't connect to database

**Symptoms:**
- Application fails to start
- "Connection refused" error
- "Database does not exist" error

**Solutions:**
1. Verify database "bank_management" exists in pgAdmin
2. Check application.properties has correct:
   - URL: jdbc:postgresql://localhost:5432/bank_management
   - Username: bank_user
   - Password: bank123
3. Ensure PostgreSQL service is running
4. Test connection using psql command line:
   psql -U bank_user -d bank_management -h localhost

---

### Issue 5: Tables not created automatically

**Symptoms:**
- Application starts but no tables in database

**Solutions:**
1. Check spring.jpa.hibernate.ddl-auto=update in application.properties
2. Check logs for Hibernate errors
3. Verify entities have @Entity annotation
4. Check if entities extend BaseEntity
5. Look for entity mapping errors in logs

---

### Issue 6: Port 5432 already in use

**Symptoms:**
- Installation fails
- Can't start PostgreSQL service
- "Address already in use" error

**Solutions:**
1. Another PostgreSQL instance might be running
2. Check for other applications using port 5432
3. During installation, choose a different port (e.g., 5433)
4. Update application.properties with new port:
   spring.datasource.url=jdbc:postgresql://localhost:5433/bank_management

---

### Issue 7: Permission denied errors

**Symptoms:**
- Can't create tables
- "permission denied for schema public"

**Solutions:**
1. Connect to database as postgres user in pgAdmin
2. Run this SQL:
   GRANT ALL ON SCHEMA public TO bank_user;
   GRANT ALL PRIVILEGES ON DATABASE bank_management TO bank_user;
3. Disconnect and reconnect
4. Try again

---

## 🆘 Getting Help

If you're stuck after trying troubleshooting steps:

**1. Gather Information**
- Screenshot of error message
- Copy full error from terminal/logs
- Note what step you're stuck on
- What you've already tried

**2. Ask for Help**
- Post in team chat with screenshots and error details
- Tag @AnishJaiswal4444
- Include: "PostgreSQL Setup Help - Step X"

**3. Don't Struggle Alone**
- If stuck for more than 15 minutes, ask!
- Better to ask than waste time
- We're a team - help each other

---

## 📚 Additional Resources

**Official Documentation:**
- PostgreSQL Docs: https://www.postgresql.org/docs/
- pgAdmin Docs: https://www.pgadmin.org/docs/

**Useful Commands:**

Check if PostgreSQL is running:
sc query postgresql-x64-15

Start PostgreSQL service:
net start postgresql-x64-15

Stop PostgreSQL service:
net stop postgresql-x64-15

Connect via command line:
psql -U bank_user -d bank_management -h localhost

List all databases:
psql -U postgres -l

---

## 🔐 Security Notes

**Passwords Used:**
- postgres user: admin123 (superuser)
- bank_user: bank123 (application user)

⚠️ **These are DEVELOPMENT passwords only!**
- Never use these in production
- Production passwords should be strong and unique
- Store production passwords in environment variables
- Never commit passwords to Git

**For this project:**
- Using simple passwords for ease of setup
- Everyone uses same passwords for consistency
- This is OK for local development
- Will change for production deployment

---

## 📝 Post-Setup Tasks

After successful setup:

**1. Update Team**
Post in team chat:
"PostgreSQL setup complete! ✅ Database: bank_management, all tables created successfully."

**2. Test Collaboration**
- Pull latest code from Git
- Run application
- Verify all entities create tables correctly
- Report any issues immediately

**3. Keep Updated**
- When new entities are added to the project
- Pull latest code
- Run application
- New tables will be auto-created
- Verify in pgAdmin

**4. Regular Maintenance**
- Periodically check PostgreSQL service is running
- If computer restarts, verify service auto-starts
- Keep pgAdmin updated when prompted

---

## 🎯 Success Criteria

You've successfully completed setup when:

✅ PostgreSQL installed and service running
✅ pgAdmin 4 working and can connect
✅ Database "bank_management" created
✅ User "bank_user" created and has privileges
✅ application.properties configured
✅ Application starts without errors
✅ All entity tables created in database
✅ Can run SQL queries in pgAdmin Query Tool
✅ Verified in team chat that setup is complete

---

## 📞 Team Contacts

**For Technical Help:**
- Anish Jaiswal (Project Lead) - @AnishJaiswal4444

**For Project Questions:**
- Vaibhav Shrivastava (Project Manager)

**Team Chat:**
- Post questions in backend channel
- Tag relevant person
- Share screenshots when asking for help

---

## 🔄 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 15, 2026 | Initial SOP created | Anish Jaiswal |

---

## ✅ Completion Confirmation

After completing all steps, please confirm in team chat:

"Setup Complete ✅
Name: [Your Name]
PostgreSQL Version: [15 or 16]
Database: bank_management created
Tables: [X] tables auto-created
Status: Ready for development

Screenshot attached."

Attach a screenshot of pgAdmin showing the tables list.

---

**Questions or feedback on this SOP?**
- Create an issue with label "documentation"
- Or message in team chat

---

*Good luck with your setup! If you follow these steps carefully, you'll be up and running in 30 minutes.* 🚀

---

**Last updated:** February 15, 2026  
**Maintained by:** Anish Jaiswal (Project Lead)
