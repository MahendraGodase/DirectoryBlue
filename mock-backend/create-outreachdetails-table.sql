-- Create OutreachDetails Table
-- Database: providerinfo
-- Server: serproviderinfo.database.windows.net

USE providerinfo;
GO

-- ============================================================
-- Create OutreachDetails Table
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
    
    PRINT '✅ outreachdetails table created successfully';
END
ELSE
BEGIN
    PRINT '⚠️  outreachdetails table already exists';
END
GO

-- ============================================================
-- Insert Sample Data
-- ============================================================

IF NOT EXISTS (SELECT * FROM outreachdetails)
BEGIN
    INSERT INTO outreachdetails (NPI, PROVIDERID, FIRSTNAME, LASTNAME, MIDDLENAME)
    VALUES 
    ('1234567890', 'PRV001', 'John', 'Smith', 'Michael'),
    ('0987654321', 'PRV002', 'Jane', 'Doe', 'Elizabeth'),
    ('1122334455', 'PRV003', 'Robert', 'Johnson', 'William'),
    ('5566778899', 'PRV004', 'Sarah', 'Williams', 'Marie'),
    ('9988776655', 'PRV005', 'Michael', 'Brown', 'James'),
    ('1111222233', 'PRV006', 'Emily', 'Davis', 'Ann'),
    ('4444555566', 'PRV007', 'David', 'Miller', 'Lee'),
    ('7777888899', 'PRV008', 'Lisa', 'Wilson', 'Grace'),
    ('2222333344', 'PRV009', 'James', 'Moore', 'Thomas'),
    ('6666777788', 'PRV010', 'Jennifer', 'Taylor', 'Lynn');
    
    PRINT '✅ Sample data inserted: 10 records';
END
ELSE
BEGIN
    PRINT '⚠️  outreachdetails table already has data';
END
GO

-- ============================================================
-- Verify Table Creation
-- ============================================================

PRINT '';
PRINT '============================================================';
PRINT 'OutreachDetails Table Setup Complete!';
PRINT '============================================================';
PRINT '';
PRINT 'Table Structure:';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'outreachdetails'
ORDER BY ORDINAL_POSITION;

PRINT '';
PRINT 'Record Count:';
SELECT COUNT(*) as TotalRecords FROM outreachdetails;

PRINT '';
PRINT 'Sample Data (First 5 records):';
SELECT TOP 5 
    Id,
    NPI,
    PROVIDERID,
    FIRSTNAME,
    LASTNAME,
    MIDDLENAME
FROM outreachdetails
ORDER BY Id;

PRINT '';
PRINT '✅ Table is ready for use!';
PRINT '============================================================';
GO

-- Made with Bob
