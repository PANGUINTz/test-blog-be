ขั้นตอนการติดตั้ง

- git clone git_remote_url
- npm install

- สร้างไฟล์ env

  - NODE_ENV=development
  - PORT=
  - DB_HOST=
  - DB_USER=
  - DB_PASSWORD=
  - DB_PORT=
  - DB_NAME=
  - JWT_SECRET_KEY=

- npm run start:dev

Application Architecture

src/ # โฟลเดอร์หลักที่เก็บ source code
├── app.module.ts # root module ของแอพ
├── main.ts # entry point ของแอพ
├── common/ # เก็บโค้ดที่ใช้ร่วมกันทั้งโปรเจค
│ ├── utils/ # เก็บ utility functions
│ └── enums/ # เก็บ enumerations
│
├── auth/ # สำหรับระบบ authentication/authorization
│ ├── dtos
│ │ └── auth.dto.ts # สำหรับตรวจสอบข้อมูลที่ได้รับจาก HTTP Request
│ ├── guards/
│ │ ├── author.guard.ts # ไว้สำหรับตรวจสอบว่าผู้ใช้นี้เป็นสร้าง blog
│ │ └── jwt.guard.ts # ไว้ใช้สำหรับการตรวจสอบ token
│ ├── strategies/
│ │ └── jwt.strategy.ts
│ │
│ ├── auth.controller.spec.ts  
│ ├── auth.module.ts  
│ ├── auth.service.ts  
│ └── auth.controller.ts  
├── users/ # สำหรับระบบ authentication/authorization
│ ├── dtos
│ │ └── user.dto.ts # สำหรับตรวจสอบข้อมูลที่ได้รับจาก HTTP Request
│ ├── entities/ # ไว้สำหรับเก็บ model schema
│ │ └── user.entity.ts
│ ├── user.controller.spec.ts  
│ ├── users.module.ts  
│ ├── users.service.ts  
│ └── users.controller.ts  
├── blogs/ # โมดูลสำหรับจัดการบล็อก
│ ├── dtos
│ │ └── blog.dto.ts # สำหรับตรวจสอบข้อมูลที่ได้รับจาก HTTP Request
│ ├── entities/ # ไว้สำหรับเก็บ model schema
│ │ └── user.entity.ts
│ ├── blog.controller.spec.ts  
│ ├── blogs.module.ts  
│ ├── blogs.service.ts  
│ └── blogs.controller.ts
├── comments/ # โมดูลสำหรับจัดการความคิดเห็น
│ ├── dtos
│ │ └── comment.dto.ts # สำหรับตรวจสอบข้อมูลที่ได้รับจาก HTTP Request
│ ├── entities/ # ไว้สำหรับเก็บ model schema
│ │ └── user.entity.ts
│ ├── comments.controller.spec.ts  
│ ├── comments.module.ts  
│ ├── comments.service.ts  
│ └── comments.controller.ts
│  
└── config/ # เก็บไฟล์การตั้งค่าต่างๆ
└── database.config.ts # สำหรับการตั้งค่าฐานข้อมูล

Library ที่ใช้

- argon2 เป็น library ไว้สำหรับการเข้ารหัสรหัสผ่าน (password hashing)
- passport เป็น authentication middleware สำหรับ Node.js
- typeorm เป็น ORM (Object-Relational Mapping) สำหรับ TypeScript
- class-validator ใช้สำหรับ validation ข้อมูลใน DTO (Data Transfer Object)
- class-transformer แปลง plain objects เป็น class instances

วิธีการรัน unit test

- npm run test

รบกวน feedback ให้ที่ pangza2544@gmail.com ด้วยนะครับ ขอบคุณครับ
