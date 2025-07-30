-- appointments
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  doctor text not null,
  date date not null,
  time time not null,
  status text default 'Scheduled',
  created_at timestamp with time zone default now()
);

-- health_metrics
create table health_metrics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  heartRate int,
  bloodPressure text,
  bloodSugar numeric,
  oxygenLevel numeric,
  temperature numeric,
  updated_at timestamp with time zone default now()
);
