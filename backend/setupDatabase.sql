create table bros (
    id_int serial primary key,
    identifier varchar (64) unique not null,
    secret_code varchar (64) not null
);

create table bots (
    id_int serial primary key,
    identifier varchar (64) not null,
    crazy_code integer not null,
    master integer references bros(id_int) on delete cascade
);
