-- Azure SQL Database Setup Script
-- Run this script in Azure Data Studio or SQL Server Management Studio
-- Connected to: serproviderinfo.database.windows.net

USE providerinfo;
GO

-- ============================================================
-- 1. Create Tasks Table
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
BEGIN
    CREATE TABLE Tasks (
        Id INT PRIMARY KEY IDENTITY(1,1),
        DataSource NVARCHAR(100),
        TaskId NVARCHAR(50) UNIQUE NOT NULL,
        CaseId NVARCHAR(50),
        NPI NVARCHAR(20),
        ProviderId NVARCHAR(50),
        ProviderName NVARCHAR(200),
        Title NVARCHAR(100),
        TaskName NVARCHAR(100),
        TaskStatus NVARCHAR(50),
        TaskAge INT,
        CRD NVARCHAR(50),
        WorkQueue NVARCHAR(100),
        AssignedTo NVARCHAR(100),
        OutboundFileDate DATE,
        CorporateReceiptDate DATE,
        CreatedDate DATETIME DEFAULT GETDATE(),
        ModifiedDate DATETIME DEFAULT GETDATE()
    );
    
    -- Create indexes for better performance
    CREATE INDEX IX_Tasks_TaskId ON Tasks(TaskId);
    CREATE INDEX IX_Tasks_NPI ON Tasks(NPI);
    CREATE INDEX IX_Tasks_ProviderId ON Tasks(ProviderId);
    CREATE INDEX IX_Tasks_TaskStatus ON Tasks(TaskStatus);
    CREATE INDEX IX_Tasks_DataSource ON Tasks(DataSource);
    
    PRINT '✅ Tasks table created successfully';
END
ELSE
BEGIN
    PRINT '⚠️  Tasks table already exists';
END
GO

-- ============================================================
-- 2. Create Dropdown Options Tables
-- ============================================================

-- Data Source Options
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DataSourceOptions')
BEGIN
    CREATE TABLE DataSourceOptions (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Value NVARCHAR(100) NOT NULL,
        Label NVARCHAR(100) NOT NULL,
        IsActive BIT DEFAULT 1
    );
    PRINT '✅ DataSourceOptions table created';
END
GO

-- Survey Type Options
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SurveyTypeOptions')
BEGIN
    CREATE TABLE SurveyTypeOptions (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Value NVARCHAR(100) NOT NULL,
        Label NVARCHAR(100) NOT NULL,
        IsActive BIT DEFAULT 1
    );
    PRINT '✅ SurveyTypeOptions table created';
END
GO

-- Task Name Options
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskNameOptions')
BEGIN
    CREATE TABLE TaskNameOptions (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Value NVARCHAR(100) NOT NULL,
        Label NVARCHAR(100) NOT NULL,
        IsActive BIT DEFAULT 1
    );
    PRINT '✅ TaskNameOptions table created';
END
GO

-- Task Status Options
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaskStatusOptions')
BEGIN
    CREATE TABLE TaskStatusOptions (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Value NVARCHAR(50) NOT NULL,
        Label NVARCHAR(50) NOT NULL,
        IsActive BIT DEFAULT 1
    );
    PRINT '✅ TaskStatusOptions table created';
END
GO

-- Assigned To Options
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AssignedToOptions')
BEGIN
    CREATE TABLE AssignedToOptions (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Value NVARCHAR(100) NOT NULL,
        Label NVARCHAR(100) NOT NULL,
        IsActive BIT DEFAULT 1
    );
    PRINT '✅ AssignedToOptions table created';
END
GO

-- Work Queue Options
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WorkQueueOptions')
BEGIN
    CREATE TABLE WorkQueueOptions (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Value NVARCHAR(100) NOT NULL,
        Label NVARCHAR(100) NOT NULL,
        IsActive BIT DEFAULT 1
    );
    PRINT '✅ WorkQueueOptions table created';
END
GO

-- ============================================================
-- 7. Create OutreachDetails Table
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'outreachdetails')
BEGIN
    CREATE TABLE outreachdetails (
        Id INT PRIMARY KEY IDENTITY(1,1),
        NPI NVARCHAR(20) NOT NULL,
        PROVIDERID NVARCHAR(50) NOT NULL,
        FIRSTNAME NVARCHAR(100) NOT NULL,
        LASTNAME NVARCHAR(100) NOT NULL,
        MIDDLENAME NVARCHAR(100),
        CreatedDate DATETIME DEFAULT GETDATE(),
        ModifiedDate DATETIME DEFAULT GETDATE()
    );
    
    -- Create indexes for better performance
    CREATE INDEX IX_OutreachDetails_NPI ON outreachdetails(NPI);
    CREATE INDEX IX_OutreachDetails_ProviderId ON outreachdetails(PROVIDERID);
    CREATE INDEX IX_OutreachDetails_LastName ON outreachdetails(LASTNAME);
    
    PRINT '✅ outreachdetails table created';
END
ELSE
BEGIN
    PRINT '⚠️  outreachdetails table already exists';
END
GO

-- ============================================================
-- 3. Insert Sample Data
-- ============================================================

-- Insert sample tasks (only if table is empty)
IF NOT EXISTS (SELECT * FROM Tasks)
BEGIN
    INSERT INTO Tasks (DataSource, TaskId, CaseId, NPI, ProviderId, ProviderName, Title, TaskName, TaskStatus, TaskAge, CRD, WorkQueue, AssignedTo, OutboundFileDate, CorporateReceiptDate)
    VALUES 
    ('CAQH', 'TSK001', 'CASE001', '1234567890', 'PRV001', 'Dr. John Smith', 'MD', 'Initial Survey', 'In Progress', 15, '2026-05-30', 'Queue A', 'user1', '2026-04-12', '2026-04-15'),
    ('Survey', 'TSK002', 'CASE002', '0987654321', 'PRV002', 'Dr. Jane Doe', 'DO', 'Re-credentialing', 'Pending', 5, '2026-06-15', 'Queue B', 'user2', '2026-05-01', '2026-05-05'),
    ('CAQH', 'TSK003', 'CASE003', '1122334455', 'PRV003', 'Dr. Robert Johnson', 'MD', 'Data Update', 'Completed', 30, '2026-05-01', 'Queue A', 'user1', '2026-03-15', '2026-03-20'),
    ('Manual', 'TSK004', 'CASE004', '5566778899', 'PRV004', 'Dr. Sarah Williams', 'MD', 'Initial Survey', 'In Progress', 8, '2026-06-20', 'Queue C', 'user3', '2026-05-05', '2026-05-08'),
    ('Survey', 'TSK005', 'CASE005', '9988776655', 'PRV005', 'Dr. Michael Brown', 'DO', 'Re-credentialing', 'Cancelled', 45, '2026-04-15', 'Queue B', 'user2', '2026-03-01', '2026-03-05');
    
    PRINT '✅ Sample tasks inserted: 5 records';
END
ELSE
BEGIN
    PRINT '⚠️  Tasks table already has data';
END
GO

-- Insert dropdown options (only if tables are empty)
IF NOT EXISTS (SELECT * FROM DataSourceOptions)
BEGIN
    INSERT INTO DataSourceOptions (Value, Label) VALUES 
    ('CAQH', 'CAQH'),
    ('Survey', 'Survey'),
    ('Manual', 'Manual Entry');
    PRINT '✅ DataSource options inserted';
END
GO

IF NOT EXISTS (SELECT * FROM SurveyTypeOptions)
BEGIN
    INSERT INTO SurveyTypeOptions (Value, Label) VALUES 
    ('Initial', 'Initial Survey'),
    ('Recred', 'Re-credentialing'),
    ('Update', 'Update Survey');
    PRINT '✅ SurveyType options inserted';
END
GO

IF NOT EXISTS (SELECT * FROM TaskNameOptions)
BEGIN
    INSERT INTO TaskNameOptions (Value, Label) VALUES 
    ('Initial Survey', 'Initial Survey'),
    ('Re-credentialing', 'Re-credentialing'),
    ('Data Update', 'Data Update');
    PRINT '✅ TaskName options inserted';
END
GO

IF NOT EXISTS (SELECT * FROM TaskStatusOptions)
BEGIN
    INSERT INTO TaskStatusOptions (Value, Label) VALUES 
    ('Pending', 'Pending'),
    ('In Progress', 'In Progress'),
    ('Completed', 'Completed'),
    ('Cancelled', 'Cancelled');
    PRINT '✅ TaskStatus options inserted';
END
GO

IF NOT EXISTS (SELECT * FROM AssignedToOptions)
BEGIN
    INSERT INTO AssignedToOptions (Value, Label) VALUES 
    ('user1', 'John Doe'),
    ('user2', 'Jane Smith'),
    ('user3', 'Bob Johnson');
    PRINT '✅ AssignedTo options inserted';
END
GO

IF NOT EXISTS (SELECT * FROM WorkQueueOptions)
BEGIN
    INSERT INTO WorkQueueOptions (Value, Label) VALUES 
    ('Queue A', 'Queue A'),
    ('Queue B', 'Queue B'),
    ('Queue C', 'Queue C');
    PRINT '✅ WorkQueue options inserted';
END
GO

-- ============================================================
-- 4. Verify Setup
-- ============================================================
PRINT '';
PRINT '============================================================';
PRINT 'Database Setup Complete!';
PRINT '============================================================';
PRINT '';
PRINT 'Tables Created:';
SELECT name FROM sys.tables WHERE name IN ('Tasks', 'DataSourceOptions', 'SurveyTypeOptions', 'TaskNameOptions', 'TaskStatusOptions', 'AssignedToOptions', 'WorkQueueOptions');
PRINT '';
PRINT 'Record Counts:';
SELECT 'Tasks' as TableName, COUNT(*) as RecordCount FROM Tasks
UNION ALL
SELECT 'DataSourceOptions', COUNT(*) FROM DataSourceOptions
UNION ALL
SELECT 'SurveyTypeOptions', COUNT(*) FROM SurveyTypeOptions
UNION ALL
SELECT 'TaskNameOptions', COUNT(*) FROM TaskNameOptions
UNION ALL
SELECT 'TaskStatusOptions', COUNT(*) FROM TaskStatusOptions
UNION ALL
SELECT 'AssignedToOptions', COUNT(*) FROM AssignedToOptions
UNION ALL
SELECT 'WorkQueueOptions', COUNT(*) FROM WorkQueueOptions;
PRINT '';
PRINT '✅ Database is ready for use!';
PRINT '============================================================';
GO

-- Made with Bob
