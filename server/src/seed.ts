import { Prisma } from '@prisma/client';
import { UserService } from './core/user/user.service';
import { DatabaseService } from './database/database.service';
import { MealService } from './modules/meal/meal.service';
import { IngredientsService } from './modules/ingredient/ingredient.service';
import { SuperAdminService } from './modules/SuperAdmin/super-admin.service';

const databaseService = new DatabaseService();
const userService = new UserService(databaseService);
const mealService = new MealService(databaseService);
const ingredientsService = new IngredientsService(databaseService);
const superAdminService = new SuperAdminService(databaseService);

async function main() {
  const users: Prisma.UserCreateInput[] = [
    {
      empNo: 'EMP001',
      organization: { connect: { id: 'O001' } },
      id: 'O001E001',
      name: 'Rachel Allen',
      role: 'KITCHEN_ADMIN',
      dob: '1988-04-21',
      telephone: '+1-721-184-7072',
      gender: 'Female',
      address: '87702 Phelps Springs, Bradleystad, DE 52474',
      email: 'fbeck@yahoo.com',
      salary: 93698,
    },
    {
      empNo: 'EMP002',
      organization: { connect: { id: 'O001' } },
      id: 'O001E002',
      name: 'Mary Bryant',
      role: 'HR_ADMIN',
      dob: '1977-11-01',
      telephone: '(959)285-1510x92165',
      gender: 'Female',
      address: '4803 Mathews Centers Apt. 685, South Saramouth, MS 16262',
      email: 'ithomas@yahoo.com',
      salary: 141178,
    },
    {
      empNo: 'EMP003',
      organization: { connect: { id: 'O002' } },
      id: 'O001E003',
      name: 'Gary Crawford',
      role: 'HR_ADMIN',
      dob: '1992-07-09',
      telephone: '008-629-9228x34279',
      gender: 'Male',
      address: '185 Crystal Path, Fisherbury, WA 67329',
      email: 'thomaselizabeth@yahoo.com',
      salary: 145154,
    },
    {
      empNo: 'EMP004',
      organization: { connect: { id: 'O002' } },
      id: 'O001E004',
      name: 'Gregory Ramos',
      role: 'KITCHEN_ADMIN',
      dob: '1975-08-28',
      telephone: '662-413-3889',
      gender: 'Female',
      address: '79013 Brian Drive, Port Danielland, IL 51257',
      email: 'charlenewilliams@hotmail.com',
      salary: 125511,
    },
    {
      empNo: 'EMP005',
      organization: { connect: { id: 'O002' } },
      id: 'O001E005',
      name: 'Kimberly Lee',
      role: 'software engineer',
      dob: '1967-10-02',
      telephone: '054-708-5742',
      gender: 'Male',
      address: '6745 Soto Crossroad, Port Annamouth, PA 78650',
      email: 'gwalker@rhodes.org',
      salary: 130328,
    },
    {
      empNo: 'EMP006',
      organization: { connect: { id: 'O002' } },
      id: 'O001E006',
      name: 'Michael King',
      role: 'KITCHEN_ADMIN',
      dob: '1987-11-24',
      telephone: '4447526440',
      gender: 'Male',
      address: '16443 Brandy Row, Snyderberg, CA 03876',
      email: 'aaron87@gmail.com',
      salary: 100134,
    },
    {
      empNo: 'EMP007',
      organization: { connect: { id: 'O001' } },
      id: 'O001E007',
      name: 'Steven Lopez',
      role: 'INVENTORY_ADMIN',
      dob: '1980-10-02',
      telephone: '935-631-6711x3814',
      gender: 'Male',
      address: '104 Michael Pines, Edwardfurt, OR 27196',
      email: 'yrodriguez@gmail.com',
      salary: 104076,
    },
    {
      empNo: 'EMP008',
      organization: { connect: { id: 'O003' } },
      id: 'O001E008',
      name: 'John Perez',
      role: 'KITCHEN_STAFF',
      dob: '1985-11-23',
      telephone: '001-183-813-3377',
      gender: 'Female',
      address: 'PSC 2322, Box 5903, APO AA 28344',
      email: 'debra01@gmail.com',
      salary: 142080,
    },
    {
      empNo: 'EMP009',
      organization: { connect: { id: 'O003' } },
      id: 'O001E009',
      name: 'Allison Brown',
      role: 'KITCHEN_ADMIN',
      dob: '1990-08-08',
      telephone: '202.510.4045',
      gender: 'Male',
      address: '23440 Cook Hills Suite 005, New Timothy, NJ 40472',
      email: 'natasha54@hotmail.com',
      salary: 50096,
    },
    {
      empNo: 'EMP010',
      organization: { connect: { id: 'O003' } },
      id: 'O001E010',
      name: 'Sarah Hopkins',
      role: 'INVENTORY_ADMIN',
      dob: '1972-06-27',
      telephone: '001-735-445-3921x21043',
      gender: 'Male',
      address: '7921 Powell River Suite 537, Port Pamelabury, MS 73093',
      email: 'robert70@hickman-parker.net',
      salary: 62833,
    },
    {
      empNo: 'EMP011',
      organization: { connect: { id: 'O001' } },
      id: 'O001E011',
      name: 'Katie Hunt',
      role: 'KITCHEN_ADMIN',
      dob: '1978-02-28',
      telephone: '001-510-819-0463',
      gender: 'Female',
      address: '1252 Karen Field, New Jenniferland, VA 83023',
      email: 'rebeccastewart@cohen.com',
      salary: 139518,
    },
    {
      empNo: 'EMP012',
      organization: { connect: { id: 'O004' } },
      id: 'O001E012',
      name: 'Michelle Freeman',
      role: 'INVENTORY_ADMIN',
      dob: '1969-03-30',
      telephone: '(482)239-4433x467',
      gender: 'Male',
      address: '72417 Ramirez Key Apt. 832, Brettshire, IA 77418',
      email: 'fgalvan@yahoo.com',
      salary: 145894,
    },
    {
      empNo: 'EMP013',
      organization: { connect: { id: 'O004' } },
      id: 'O001E013',
      name: 'Kim Cunningham',
      role: 'INVENTORY_ADMIN',
      dob: '1975-03-17',
      telephone: '(543)892-7876x749',
      gender: 'Female',
      address: '1464 Crawford Parkways Suite 946, Brownton, IN 49891',
      email: 'karenjohnson@potter.biz',
      salary: 100810,
    },
    {
      empNo: 'EMP014',
      organization: { connect: { id: 'O004' } },
      id: 'O001E014',
      name: 'Kevin Scott',
      role: 'HR_ADMIN',
      dob: '1992-11-14',
      telephone: '001-458-237-7600x541',
      gender: 'Male',
      address: '600 Joseph Groves, Troyburgh, DE 14317',
      email: 'spencersamantha@nichols-aguilar.com',
      salary: 74069,
    },
    {
      empNo: 'EMP015',
      organization: { connect: { id: 'O001' } },
      id: 'O001E015',
      name: 'Ricky Valenzuela',
      role: 'KITCHEN_STAFF',
      dob: '2001-12-16',
      telephone: '031.520.4316',
      gender: 'Male',
      address: '374 Melissa Keys, East Jimmytown, DC 20955',
      email: 'bryancombs@gmail.com',
      salary: 104250,
    },
    {
      empNo: 'EMP016',
      organization: { connect: { id: 'O001' } },
      id: 'O001E016',
      name: 'Levi Atkinson',
      role: 'KITCHEN_STAFF',
      dob: '1972-07-06',
      telephone: '+1-260-654-4547x888',
      gender: 'Female',
      address: '799 Wise Hills Suite 529, South Sarahport, NY 70434',
      email: 'wsmith@odom.net',
      salary: 104608,
    },
    {
      empNo: 'EMP017',
      organization: { connect: { id: 'O001' } },
      id: 'O001E017',
      name: 'Kaitlyn Parker',
      role: 'KITCHEN_STAFF',
      dob: '1978-08-01',
      telephone: '3065805090',
      gender: 'Female',
      address: '255 Bailey Walks, North Lisa, PA 15893',
      email: 'travis28@flores.info',
      salary: 62709,
    },
    {
      empNo: 'EMP018',
      organization: { connect: { id: 'O001' } },
      id: 'O001E018',
      name: 'Caroline Smith',
      role: 'KITCHEN_STAFF',
      dob: '1986-06-05',
      telephone: '852.513.9626',
      gender: 'Female',
      address: '81496 Johns Extension, East Joseph, SD 74481',
      email: 'wallacebenjamin@gmail.com',
      salary: 57755,
    },
    {
      empNo: 'EMP019',
      organization: { connect: { id: 'O001' } },
      id: 'O001E019',
      name: 'Michelle Martinez',
      role: 'KITCHEN_ADMIN',
      dob: '1994-06-08',
      telephone: '(369)086-6615',
      gender: 'Female',
      address: '82436 Vazquez Ford, Castroville, SD 09271',
      email: 'joseph95@jimenez.com',
      salary: 78043,
    },
    {
      empNo: 'EMP020',
      organization: { connect: { id: 'O001' } },
      id: 'O001E020',
      name: 'Kayla Hernandez',
      role: 'HR_ADMIN',
      dob: '1984-07-02',
      telephone: '022.984.9027x7199',
      gender: 'Female',
      address: '7256 Sims Parks, Parkshaven, AR 72096',
      email: 'dyernatalie@fuller.com',
      salary: 106227,
    },
    {
      empNo: 'EMP021',
      organization: { connect: { id: 'O001' } },
      id: 'O001E021',
      name: 'Robert Pena',
      role: 'INVENTORY_ADMIN',
      dob: '1998-02-12',
      telephone: '001-736-465-4537',
      gender: 'Female',
      address: '00490 Choi Expressway Apt. 675, Toddport, CT 40575',
      email: 'mrogers@russell-mitchell.org',
      salary: 141586,
    },
    {
      empNo: 'EMP022',
      organization: { connect: { id: 'O001' } },
      id: 'O001E022',
      name: 'Justin Perry',
      role: 'KITCHEN_STAFF',
      dob: '1971-09-14',
      telephone: '001-369-023-4735',
      gender: 'Male',
      address: '5134 Mitchell Squares Apt. 207, Kaylaborough, AK 83658',
      email: 'mallen@davis.com',
      salary: 110140,
    },
    {
      empNo: 'EMP023',
      organization: { connect: { id: 'O001' } },
      id: 'O001E023',
      name: 'Kaitlyn Taylor',
      role: 'HR_ADMIN',
      dob: '1992-06-14',
      telephone: '001-737-483-1831',
      gender: 'Female',
      address: '6447 Williams Flat, Steinside, WV 03219',
      email: 'jsmith@gmail.com',
      salary: 58958,
    },
    {
      empNo: 'EMP024',
      organization: { connect: { id: 'O001' } },
      id: 'O001E024',
      name: 'Latoya Elliott',
      role: 'INVENTORY_ADMIN',
      dob: '1971-12-04',
      telephone: '2019551365',
      gender: 'Male',
      address: '965 Lloyd Motorway, Lake Melissa, DC 63219',
      email: 'flynncindy@hotmail.com',
      salary: 128063,
    },
    {
      empNo: 'EMP025',
      organization: { connect: { id: 'O001' } },
      id: 'O001E025',
      name: 'John Wiley',
      role: 'INVENTORY_ADMIN',
      dob: '1975-09-25',
      telephone: '615-721-8759x60172',
      gender: 'Male',
      address: '084 Troy Ridges, North William, GA 17421',
      email: 'paulagarcia@lozano.net',
      salary: 69093,
    },
    {
      empNo: 'EMP026',
      organization: { connect: { id: 'O001' } },
      id: 'O001E026',
      name: 'Corey Kim',
      role: 'INVENTORY_ADMIN',
      dob: '1966-06-04',
      telephone: '243-399-9431x685',
      gender: 'Male',
      address: '261 Amanda Neck Apt. 670, New Daniel, NJ 19227',
      email: 'stephanie88@yahoo.com',
      salary: 64110,
    },
    {
      empNo: 'EMP027',
      organization: { connect: { id: 'O001' } },
      id: 'O001E027',
      name: 'Jerry Romero',
      role: 'KITCHEN_STAFF',
      dob: '2003-12-22',
      telephone: '001-305-590-6462x3251',
      gender: 'Male',
      address: '90826 Cody Ranch Suite 615, Buckshire, MT 22712',
      email: 'catherine27@baker-swanson.com',
      salary: 101676,
    },
    {
      empNo: 'EMP028',
      organization: { connect: { id: 'O001' } },
      id: 'O001E028',
      name: 'Beth Lang',
      role: 'KITCHEN_STAFF',
      dob: '2007-04-27',
      telephone: '109.076.8342x42577',
      gender: 'Female',
      address: '0984 Erin Ford Apt. 168, Baileyland, NE 40876',
      email: 'erivas@gmail.com',
      salary: 83306,
    },
    {
      empNo: 'EMP029',
      organization: { connect: { id: 'O001' } },
      id: 'O001E029',
      name: 'Michaela Holland',
      role: 'software engineer',
      dob: '1997-05-07',
      telephone: '001-130-327-8927',
      gender: 'Female',
      address: 'PSC 8862, Box 1286, APO AE 15022',
      email: 'hannabruce@henderson-morgan.com',
      salary: 111401,
    },
    {
      empNo: 'EMP030',
      organization: { connect: { id: 'O001' } },
      id: 'O001E030',
      name: 'Lisa Burke DVM',
      role: 'KITCHEN_ADMIN',
      dob: '1965-10-31',
      telephone: '195-776-6687',
      gender: 'Male',
      address: 'PSC 1152, Box 3689, APO AE 54958',
      email: 'kbowman@munoz.com',
      salary: 81772,
    },
    {
      empNo: 'EMP031',
      organization: { connect: { id: 'O001' } },
      id: 'O001E031',
      name: 'Melissa Duffy',
      role: 'INVENTORY_ADMIN',
      dob: '1976-09-13',
      telephone: '001-279-777-9836',
      gender: 'Male',
      address: '18251 Timothy Ford, Port Shannon, OR 80956',
      email: 'lucas31@yahoo.com',
      salary: 141494,
    },
    {
      empNo: 'EMP032',
      organization: { connect: { id: 'O001' } },
      id: 'O001E032',
      name: 'Jonathan Kelley',
      role: 'HR_ADMIN',
      dob: '1982-04-19',
      telephone: '118.638.4422x3161',
      gender: 'Male',
      address: '141 Michelle Inlet Suite 374, Mitchellburgh, CA 87365',
      email: 'catherinelee@johnson-scott.net',
      salary: 109419,
    },
    {
      empNo: 'EMP033',
      organization: { connect: { id: 'O001' } },
      id: 'O001E033',
      name: 'Katherine Deleon',
      role: 'KITCHEN_ADMIN',
      dob: '1993-07-18',
      telephone: '001-461-343-6862',
      gender: 'Female',
      address: '490 Angela Oval Apt. 345, Amyview, SC 95696',
      email: 'diana74@baker.org',
      salary: 53252,
    },
    {
      empNo: 'EMP034',
      organization: { connect: { id: 'O001' } },
      id: 'O001E034',
      name: 'Maria Anderson PhD',
      role: 'HR_ADMIN',
      dob: '2007-01-24',
      telephone: '(040)592-0153x254',
      gender: 'Male',
      address: '84694 Rodgers Freeway Apt. 997, East Anthony, MO 00811',
      email: 'victorhenderson@hotmail.com',
      salary: 115140,
    },
    {
      empNo: 'EMP035',
      organization: { connect: { id: 'O001' } },
      id: 'O001E035',
      name: 'April Montoya',
      role: 'HR_ADMIN',
      dob: '1997-10-19',
      telephone: '920.719.2360x82329',
      gender: 'Male',
      address: '766 Glenn Spurs Suite 989, Karenshire, WV 90858',
      email: 'michael55@golden.com',
      salary: 55592,
    },
    {
      empNo: 'EMP036',
      organization: { connect: { id: 'O001' } },
      id: 'O001E036',
      name: 'Eddie Jordan',
      role: 'HR_ADMIN',
      dob: '2004-10-27',
      telephone: '637-837-3263x84407',
      gender: 'Male',
      address: '4437 Catherine Landing Apt. 289, West Amandafurt, AZ 12091',
      email: 'trobbins@holland-reed.org',
      salary: 124746,
    },
    {
      empNo: 'EMP037',
      organization: { connect: { id: 'O001' } },
      id: 'O001E037',
      name: 'Michaela Phillips',
      role: 'KITCHEN_STAFF',
      dob: '1980-06-14',
      telephone: '582.671.4305',
      gender: 'Male',
      address: '393 Pennington Key Apt. 474, Davenportshire, TN 67842',
      email: 'tyler37@hodge.com',
      salary: 75254,
    },
    {
      empNo: 'EMP038',
      organization: { connect: { id: 'O001' } },
      id: 'O001E038',
      name: 'Cory Perez',
      role: 'INVENTORY_ADMIN',
      dob: '1976-05-30',
      telephone: '424.111.1843x49279',
      gender: 'Female',
      address: '8471 Holloway Lodge Apt. 774, Crystalchester, LA 97287',
      email: 'pholloway@shaw.com',
      salary: 77664,
    },
    {
      empNo: 'EMP039',
      organization: { connect: { id: 'O001' } },
      id: 'O001E039',
      name: 'Michaela Wilson',
      role: 'KITCHEN_ADMIN',
      dob: '1966-04-15',
      telephone: '001-891-697-3418x08680',
      gender: 'Male',
      address: '4157 Butler Avenue Suite 708, Josephfort, TN 33334',
      email: 'dennislarry@sanchez.biz',
      salary: 93328,
    },
    {
      empNo: 'EMP457',
      organization: { connect: { id: 'O001' } },
      id: 'E457',
      name: 'Anji Kit',
      role: 'KITCHEN_ADMIN',
      dob: '1983-02-15',
      telephone: '4911249283',
      salary: 65000,
      gender: 'male',
      address: '435 Elizabeth Stravenue, Williamsland, CA 32888',
      email: 'anjanaape2002@gmail.com',
    },
    {
      empNo: 'EMP457',
      organization: { connect: { id: 'O001' } },
      id: 'E456',
      name: 'Anji',
      role: 'HR_ADMIN',
      dob: '1983-02-15',
      telephone: '4911249283',
      salary: 65000,
      gender: 'male',
      address: '435 Elizabeth Stravenue, Williamsland, CA 32888',
      email: 'Chamilka2002@gmail.com',
    },
  ];

  const organizations: Prisma.OrganizationCreateInput[] = [
    {
      id: 'O001',
      name: 'TechCorp Solutions',
      logoUrl: 'https://example.com/logos/techcorp.png',
      contactEmail: 'contact@techcorp.com',
      active: true,
      createdAt: '2024-01-15T08:30:00.000Z',
      updatedAt: '2024-12-10T14:22:00.000Z',
      fingerprint_capacity: 1000,
      fingerprint_per_machine: 50,
    },
    {
      id: 'O002',
      name: 'Global Industries Inc',
      logoUrl: 'https://example.com/logos/global-industries.png',
      contactEmail: 'info@globalindustries.com',
      active: true,
      createdAt: '2024-02-20T10:45:00.000Z',
      updatedAt: '2024-11-28T16:15:00.000Z',
      fingerprint_capacity: 2500,
      fingerprint_per_machine: 100,
    },
    {
      id: 'O003',
      name: 'StartupHub',
      logoUrl: null,
      contactEmail: 'hello@startuphub.io',
      active: true,
      createdAt: '2024-03-05T12:00:00.000Z',
      updatedAt: '2024-12-01T09:30:00.000Z',
      fingerprint_capacity: 500,
      fingerprint_per_machine: 25,
    },
    {
      id: 'O004',
      name: 'Enterprise Systems Ltd',
      logoUrl: 'https://example.com/logos/enterprise-systems.png',
      contactEmail: 'support@enterprisesystems.com',
      active: false,
      createdAt: '2024-01-10T14:20:00.000Z',
      updatedAt: '2024-10-15T11:45:00.000Z',
      fingerprint_capacity: 3000,
      fingerprint_per_machine: 150,
    },
 
  ];

  // const ingredients: Prisma.IngredientCreateInput[] = [
  //   {
  //     name: 'Tomato',
  //     price_per_unit: 19,
  //     quantity: '36',
  //     type: 'Vegetables',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Apple',
  //     price_per_unit: 13,
  //     quantity: '53',
  //     type: 'Fruits',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Wheat Flour',
  //     price_per_unit: 7,
  //     quantity: '95',
  //     type: 'Grains & Cereals',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Condensed Milk',
  //     price_per_unit: 8,
  //     quantity: '29',
  //     type: 'Dairy Products',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Minced Beef',
  //     price_per_unit: 2,
  //     quantity: '80',
  //     type: 'Meat & Poultry',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Paprika',
  //     price_per_unit: 17,
  //     quantity: '90',
  //     type: 'Spices & Condiments',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Iced Tea',
  //     price_per_unit: 2,
  //     quantity: '66',
  //     type: 'Beverages',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Olive Oil',
  //     price_per_unit: 5,
  //     quantity: '49',
  //     type: 'Oils & Fats',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Chocolate',
  //     price_per_unit: 7,
  //     quantity: '44',
  //     type: 'Bakery & Sweets',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Canned Corn',
  //     price_per_unit: 15,
  //     quantity: '23',
  //     type: 'Processed & Canned',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Pepper',
  //     price_per_unit: 14,
  //     quantity: '46',
  //     type: 'Vegetables',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Strawberry',
  //     price_per_unit: 5,
  //     quantity: '61',
  //     type: 'Fruits',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Millet',
  //     price_per_unit: 9,
  //     quantity: '80',
  //     type: 'Grains & Cereals',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Paneer',
  //     price_per_unit: 19,
  //     quantity: '43',
  //     type: 'Dairy Products',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Pork',
  //     price_per_unit: 13,
  //     quantity: '41',
  //     type: 'Meat & Poultry',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Garlic Powder',
  //     price_per_unit: 11,
  //     quantity: '93',
  //     type: 'Spices & Condiments',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Soft Drink',
  //     price_per_unit: 20,
  //     quantity: '64',
  //     type: 'Beverages',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Margarine',
  //     price_per_unit: 10,
  //     quantity: '82',
  //     type: 'Oils & Fats',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Cookies',
  //     price_per_unit: 1,
  //     quantity: '41',
  //     type: 'Bakery & Sweets',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Canned Tomatoes',
  //     price_per_unit: 9,
  //     quantity: '39',
  //     type: 'Processed & Canned',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Pepper',
  //     price_per_unit: 3,
  //     quantity: '49',
  //     type: 'Vegetables',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Banana',
  //     price_per_unit: 20,
  //     quantity: '48',
  //     type: 'Fruits',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Millet',
  //     price_per_unit: 13,
  //     quantity: '40',
  //     type: 'Grains & Cereals',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Yogurt',
  //     price_per_unit: 16,
  //     quantity: '65',
  //     type: 'Dairy Products',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Duck',
  //     price_per_unit: 12,
  //     quantity: '53',
  //     type: 'Meat & Poultry',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Cinnamon',
  //     price_per_unit: 9,
  //     quantity: '34',
  //     type: 'Spices & Condiments',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Soft Drink',
  //     price_per_unit: 3,
  //     quantity: '81',
  //     type: 'Beverages',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Lard',
  //     price_per_unit: 10,
  //     quantity: '43',
  //     type: 'Oils & Fats',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Donut',
  //     price_per_unit: 9,
  //     quantity: '31',
  //     type: 'Bakery & Sweets',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Canned Tomatoes',
  //     price_per_unit: 10,
  //     quantity: '36',
  //     type: 'Processed & Canned',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Broccoli',
  //     price_per_unit: 3,
  //     quantity: '79',
  //     type: 'Vegetables',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Strawberry',
  //     price_per_unit: 12,
  //     quantity: '23',
  //     type: 'Fruits',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Rye',
  //     price_per_unit: 19,
  //     quantity: '84',
  //     type: 'Grains & Cereals',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Cream',
  //     price_per_unit: 13,
  //     quantity: '23',
  //     type: 'Dairy Products',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Pork',
  //     price_per_unit: 4,
  //     quantity: '28',
  //     type: 'Meat & Poultry',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Coriander',
  //     price_per_unit: 13,
  //     quantity: '11',
  //     type: 'Spices & Condiments',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Tea',
  //     price_per_unit: 20,
  //     quantity: '57',
  //     type: 'Beverages',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Sunflower Oil',
  //     price_per_unit: 4,
  //     quantity: '90',
  //     type: 'Oils & Fats',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Croissant',
  //     price_per_unit: 17,
  //     quantity: '86',
  //     type: 'Bakery & Sweets',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Peanut Butter',
  //     price_per_unit: 19,
  //     quantity: '11',
  //     type: 'Processed & Canned',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Cauliflower',
  //     price_per_unit: 15,
  //     quantity: '99',
  //     type: 'Vegetables',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Orange',
  //     price_per_unit: 12,
  //     quantity: '82',
  //     type: 'Fruits',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Barley',
  //     price_per_unit: 15,
  //     quantity: '41',
  //     type: 'Grains & Cereals',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Buttermilk',
  //     price_per_unit: 13,
  //     quantity: '78',
  //     type: 'Dairy Products',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Minced Beef',
  //     price_per_unit: 14,
  //     quantity: '45',
  //     type: 'Meat & Poultry',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Coriander',
  //     price_per_unit: 8,
  //     quantity: '87',
  //     type: 'Spices & Condiments',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Iced Tea',
  //     price_per_unit: 6,
  //     quantity: '18',
  //     type: 'Beverages',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Ghee',
  //     price_per_unit: 17,
  //     quantity: '58',
  //     type: 'Oils & Fats',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Pastry',
  //     price_per_unit: 3,
  //     quantity: '15',
  //     type: 'Bakery & Sweets',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Canned Soup',
  //     price_per_unit: 6,
  //     quantity: '33',
  //     type: 'Processed & Canned',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Potato',
  //     price_per_unit: 14,
  //     quantity: '13',
  //     type: 'Vegetables',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Papaya',
  //     price_per_unit: 6,
  //     quantity: '97',
  //     type: 'Fruits',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Buckwheat',
  //     price_per_unit: 7,
  //     quantity: '43',
  //     type: 'Grains & Cereals',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Paneer',
  //     price_per_unit: 14,
  //     quantity: '26',
  //     type: 'Dairy Products',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Sausage',
  //     price_per_unit: 5,
  //     quantity: '87',
  //     type: 'Meat & Poultry',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Coriander',
  //     price_per_unit: 2,
  //     quantity: '36',
  //     type: 'Spices & Condiments',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Tea',
  //     price_per_unit: 10,
  //     quantity: '73',
  //     type: 'Beverages',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Canola Oil',
  //     price_per_unit: 7,
  //     quantity: '83',
  //     type: 'Oils & Fats',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Brownie',
  //     price_per_unit: 6,
  //     quantity: '80',
  //     type: 'Bakery & Sweets',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Pickles',
  //     price_per_unit: 5,
  //     quantity: '25',
  //     type: 'Processed & Canned',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Broccoli',
  //     price_per_unit: 20,
  //     quantity: '99',
  //     type: 'Vegetables',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Apple',
  //     price_per_unit: 1,
  //     quantity: '15',
  //     type: 'Fruits',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Buckwheat',
  //     price_per_unit: 4,
  //     quantity: '60',
  //     type: 'Grains & Cereals',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Cheese',
  //     price_per_unit: 13,
  //     quantity: '52',
  //     type: 'Dairy Products',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Sausage',
  //     price_per_unit: 13,
  //     quantity: '66',
  //     type: 'Meat & Poultry',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Turmeric',
  //     price_per_unit: 11,
  //     quantity: '38',
  //     type: 'Spices & Condiments',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Coconut Water',
  //     price_per_unit: 12,
  //     quantity: '93',
  //     type: 'Beverages',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Vegetable Oil',
  //     price_per_unit: 10,
  //     quantity: '74',
  //     type: 'Oils & Fats',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Chocolate',
  //     price_per_unit: 19,
  //     quantity: '47',
  //     type: 'Bakery & Sweets',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Canned Peas',
  //     price_per_unit: 13,
  //     quantity: '68',
  //     type: 'Processed & Canned',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Lettuce',
  //     price_per_unit: 2,
  //     quantity: '33',
  //     type: 'Vegetables',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Grapes',
  //     price_per_unit: 10,
  //     quantity: '83',
  //     type: 'Fruits',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Millet',
  //     price_per_unit: 13,
  //     quantity: '66',
  //     type: 'Grains & Cereals',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Condensed Milk',
  //     price_per_unit: 6,
  //     quantity: '63',
  //     type: 'Dairy Products',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Sausage',
  //     price_per_unit: 9,
  //     quantity: '89',
  //     type: 'Meat & Poultry',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Chili Powder',
  //     price_per_unit: 19,
  //     quantity: '36',
  //     type: 'Spices & Condiments',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Lemonade',
  //     price_per_unit: 3,
  //     quantity: '78',
  //     type: 'Beverages',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Palm Oil',
  //     price_per_unit: 12,
  //     quantity: '77',
  //     type: 'Oils & Fats',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Chocolate',
  //     price_per_unit: 15,
  //     quantity: '52',
  //     type: 'Bakery & Sweets',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Baked Beans',
  //     price_per_unit: 7,
  //     quantity: '46',
  //     type: 'Processed & Canned',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Spinach',
  //     price_per_unit: 4,
  //     quantity: '53',
  //     type: 'Vegetables',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Strawberry',
  //     price_per_unit: 16,
  //     quantity: '97',
  //     type: 'Fruits',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Millet',
  //     price_per_unit: 9,
  //     quantity: '62',
  //     type: 'Grains & Cereals',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Yogurt',
  //     price_per_unit: 7,
  //     quantity: '18',
  //     type: 'Dairy Products',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Chicken Breast',
  //     price_per_unit: 16,
  //     quantity: '58',
  //     type: 'Meat & Poultry',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Ginger',
  //     price_per_unit: 5,
  //     quantity: '54',
  //     type: 'Spices & Condiments',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Lemonade',
  //     price_per_unit: 7,
  //     quantity: '95',
  //     type: 'Beverages',
  //     priority: 3,
  //   },
  //   {
  //     name: 'Coconut Oil',
  //     price_per_unit: 9,
  //     quantity: '30',
  //     type: 'Oils & Fats',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Donut',
  //     price_per_unit: 11,
  //     quantity: '57',
  //     type: 'Bakery & Sweets',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Pickles',
  //     price_per_unit: 8,
  //     quantity: '17',
  //     type: 'Processed & Canned',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Carrot',
  //     price_per_unit: 10,
  //     quantity: '20',
  //     type: 'Vegetables',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Blueberry',
  //     price_per_unit: 6,
  //     quantity: '31',
  //     type: 'Fruits',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Oats',
  //     price_per_unit: 7,
  //     quantity: '22',
  //     type: 'Grains & Cereals',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Cream',
  //     price_per_unit: 5,
  //     quantity: '47',
  //     type: 'Dairy Products',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Chicken Breast',
  //     price_per_unit: 17,
  //     quantity: '15',
  //     type: 'Meat & Poultry',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Coriander',
  //     price_per_unit: 10,
  //     quantity: '81',
  //     type: 'Spices & Condiments',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Smoothie',
  //     price_per_unit: 16,
  //     quantity: '58',
  //     type: 'Beverages',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Vegetable Oil',
  //     price_per_unit: 2,
  //     quantity: '75',
  //     type: 'Oils & Fats',
  //     priority: 1,
  //   },
  //   {
  //     name: 'Chocolate',
  //     price_per_unit: 20,
  //     quantity: '60',
  //     type: 'Bakery & Sweets',
  //     priority: 2,
  //   },
  //   {
  //     name: 'Baked Beans',
  //     price_per_unit: 20,
  //     quantity: '68',
  //     type: 'Processed & Canned',
  //     priority: 2,
  //   },
  // ];

  try {
    for (const organization of organizations) {
      await superAdminService.createOrganization(organization);
    }
    console.log('Org created successfully.');

    // Create users
    for (const user of users) {
      await userService.create(user);
    }
    console.log('Users created successfully.');

    // Create meals
    const meals: Prisma.MealCreateInput[] = [];
    for (const meal of meals) {
      await mealService.createWithIngredients(meal, []);
    }
    console.log('Meals created successfully.');

    // Create ingredients
    // for (const ingredient of ingredients) {
    //   await ingredientsService.create(ingredient);
    // }
    console.log('Ingredients created successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await databaseService.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error running seed script:', error);
  process.exit(1);
});
