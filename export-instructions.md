# Database Export Instructions

Since you've restored your old database URL to the .env file, here are the methods to export your PostgreSQL database:

## Method 1: Using pg_dump (Recommended for complete backup)

First, make sure you have PostgreSQL client tools installed. Then run:

```bash
# For a full SQL dump (structure + data)
pg_dump "your-database-url-here" --clean --create --inserts > exports/full_backup.sql

# For a compressed backup
pg_dump "your-database-url-here" --clean --create -Fc > exports/full_backup.backup
```

## Method 2: Manual Connection and Export

If you have the DATABASE_URL in your .env file, you can:

1. Copy your DATABASE_URL from .env
2. Use any PostgreSQL client (pgAdmin, DBeaver, etc.)
3. Connect using the URL
4. Export all tables as SQL or CSV

## Method 3: Using pg_dump with connection details

If your DATABASE_URL looks like: `postgresql://username:password@host:port/database`

Extract the parts and run:
```bash
pg_dump -h [host] -p [port] -U [username] -d [database] --clean --create --inserts -f exports/database_backup.sql
```

## Method 4: Table-by-table export (if needed)

```sql
-- Connect to your database and run these commands
COPY companies TO '/path/to/companies.csv' DELIMITER ',' CSV HEADER;
COPY forms TO '/path/to/forms.csv' DELIMITER ',' CSV HEADER;
COPY question_categories TO '/path/to/question_categories.csv' DELIMITER ',' CSV HEADER;
COPY questions TO '/path/to/questions.csv' DELIMITER ',' CSV HEADER;
COPY submissions TO '/path/to/submissions.csv' DELIMITER ',' CSV HEADER;
COPY answers TO '/path/to/answers.csv' DELIMITER ',' CSV HEADER;
COPY reports TO '/path/to/reports.csv' DELIMITER ',' CSV HEADER;
```

## What to do next:

1. Create an `exports` directory in your project root
2. Choose one of the methods above
3. Run the export command
4. Your data will be saved in the exports folder
5. You can then import this data into your new database

## Important Notes:

- The `--clean` flag will include DROP statements
- The `--create` flag will include CREATE DATABASE statement  
- The `--inserts` flag uses INSERT statements instead of COPY (more portable)
- For large databases, consider using the compressed format (-Fc)

Choose the method that works best with your setup!