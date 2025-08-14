-- Create table `profiles`
-- ตารางสำหรับเก็บข้อมูลส่วนตัวของผู้ใช้
-- โดย 'id' จะอ้างอิงถึงตาราง 'auth.users' โดยอัตโนมัติเมื่อกำหนด UUID
create table profiles (
  id uuid references auth.users not null,
  full_name text,
  first_name text,
  last_name text,
  avatar_url text,
  nickname text,
  age int4,
  primary key (id)
);
-- Create table `status_task`
-- ตารางสำหรับเก็บสถานะของงาน
create table status_task (
  id uuid primary key,
  status_name text,
  description text
);
-- Create table `task`
-- ตารางสำหรับเก็บงานหลัก
-- มี Foreign Key ที่อ้างอิงถึง `profiles` (ผ่าน `user_id`) และ `status_task` (ผ่าน `status_id`)
create table task (
  id uuid primary key,
  task_name text,
  task_description text,
  start_date date,
  end_date date,
  user_id uuid references profiles (id) on delete cascade,
  status_id uuid references status_task (id) on delete set null
);
-- Create table `todo`
-- ตารางสำหรับเก็บรายการ Todo
-- มี Foreign Key ที่อ้างอิงถึง `profiles` (ผ่าน `user_id`) และ `status_task` (ผ่าน `status_id`)
create table todo (
  id uuid primary key,
  todo_name text,
  todo_description text,
  user_id uuid references profiles (id) on delete cascade,
  status_id uuid references status_task (id) on delete set null
);
-- Create table `finance`
-- ตารางสำหรับบันทึกข้อมูลการเงิน
-- มี Foreign Key ที่อ้างอิงถึง `profiles` (ผ่าน `user_id`)
create table finance (
  id uuid primary key,
  finance_description text,
  amount int,
  date date,
  user_id uuid references profiles (id) on delete cascade
);