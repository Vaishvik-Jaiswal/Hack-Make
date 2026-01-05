# ODOP Marketplace - Database Setup Guide

## Prerequisites
- MySQL Server 8.0 or higher
- Command line access to MySQL

## Setup Instructions

### 1. Create Database
```bash
mysql -u root -p
CREATE DATABASE odop_marketplace;
```

### 2. Create Tables
```bash
mysql -u root -p odop_marketplace < schema.sql
```

### 3. Insert Sample Data (Optional)
```bash
mysql -u root -p odop_marketplace < seed.sql
```

## Database Schema

### sellers table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| phone | VARCHAR(10) | Unique phone number |
| shop_name | VARCHAR(100) | Name of the shop |
| artisan_name | VARCHAR(100) | Name of the artisan |
| district | VARCHAR(50) | District in Madhya Pradesh |
| udyam_number | VARCHAR(20) | Udyam registration number |
| is_profile_complete | BOOLEAN | Profile completion status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### otp_codes table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| phone | VARCHAR(10) | Phone number for OTP |
| code | VARCHAR(6) | 6-digit OTP code |
| created_at | TIMESTAMP | When OTP was created |
| expires_at | TIMESTAMP | When OTP expires |

### otp_attempts table (Optional)
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| phone | VARCHAR(10) | Phone number |
| attempt_count | INT | Number of attempts |
| last_attempt | TIMESTAMP | Last attempt time |
| is_blocked | BOOLEAN | Whether phone is blocked |
| blocked_until | TIMESTAMP | Block expiry time |

## Valid Districts
- Indore, Bhopal, Jabalpur, Ujjain, Gwalior
- And 27 other districts in Madhya Pradesh (see validators.js)
