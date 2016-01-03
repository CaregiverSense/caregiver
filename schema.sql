create table user (
	userId 		integer auto_increment primary key,
	tagId		varchar(8),

	name 		varchar(128),
	email 		varchar(128),

	fbId 		varchar(20) not null unique key,
	fbLink		varchar(128),

	role		varchar(20) not null,

	first_name  varchar(100),
	last_name   varchar(100),
	locale      varchar(20),
	timezone    varchar(20),
	patientId	integer references user(userId)
);


drop table allergy;
create table allergy (
	allergyId integer primary key auto_increment,
	name varchar(100) not null unique key
);

insert into allergy (name) values ('Aspirin');
insert into allergy (name) values ('Codein');
insert into allergy (name) values ('Ibuprofen');
insert into allergy (name) values ('Iodine');
insert into allergy (name) values ('Tetracycline');
insert into allergy (name) values ('Sulfa drugs');
insert into allergy (name) values ('Metals');
insert into allergy (name) values ('Latex');
insert into allergy (name) values ('Penicillin');
insert into allergy (name) values ('Anesthetic');
insert into allergy (name) values ('Shell fish');
insert into allergy (name) values ('Sulfite');
insert into allergy (name) values ('Other');

create table user_allergy (
	uaId integer auto_increment primary key,
	userId integer not null references user(userId),
	allergyId integer not null references allergy(allergyId)
);


insert into user_allergy (userId, allergyId) values (10, 1);
insert into user_allergy (userId, allergyId) values (10, 8);

insert into user_allergy (userId, allergyId) values (15, 3);
insert into user_allergy (userId, allergyId) values (15, 4);

drop table notes;
create table notes (
	noteId		integer auto_increment primary key,
	content         varchar(1000),
	lastUpdated     datetime not null,
	byUserId	integer not null references user(userId),
	forUserId	integer not null references user(userId),
	patientVisible  varchar(10)
)


drop table schedule;

create table schedule (
        schedId integer auto_increment primary key,
        name varchar(1000) not null,
        description varchar(1000) not null,
        toUserId integer not null references user(userId),
        fromUserId integer not null references user(userId),
        time datetime not null,
        date datetime not null,
        completed integer not null default 0,
        directions varchar(1000)
)


create table registration (
	regId integer auto_increment primary key,
	registrationDate datetime not null,
	name varchar(100) not null,
	email varchar(100) not null,
	phoneNumber varchar(100) not null,
    wasEmailed char(1) not null default 'N',
    hasRegistered char(1) not null default 'N',
    registrationLink varchar(200) not null
)

alter table user add column registration_date datetime;

-- Store the quick dial phone numbers for a user
create table dial (
	dialId 		integer not null primary key auto_increment,	-- primary key
	userId 		integer not null references user(userId),		-- the user who the number is for
	phone		varchar(30) not null,							-- the phone number (without the tel:// prefix)
	label		varchar(80) not null,							-- the label to use for the phone number
	rank		integer not null default 0						-- used to sort and reorder the numbers for a user
);

-- Places that can be associated to users.
create table place (
	placeId		integer not null primary key auto_increment,	-- primary key
	placeName	varchar(200) not null,							-- the name of the placd
	address		varchar(400) not null							-- the address of the place
);

-- Places associated to users.  The label field allows a place to be renamed for a user.
create table user_place (
	uaId		integer not null primary key auto_increment,	-- primary key
	userId		integer not null references user(userId),		-- the user to whom the place is assigsned
	placeId		integer not null references place(placeId),		-- the address of the place
	label		varchar(80) not null,							-- the label to represent the address
	rank		integer not null default 0						-- used to sort and re-order
);

