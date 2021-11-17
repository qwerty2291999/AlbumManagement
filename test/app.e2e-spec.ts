import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  // eslint-disable-next-line no-var
  var jwt = '';
  const userRandom = {
    name: 'Duong Van Lodsfsdfng',
    userName: Math.random() * 1,
    password: 'long12asdsf3',
    email: Math.random() * 1,
  };
  const user = {
    name: 'Duong Van Long',
    userName: 'long229',
    password: 'long123',
    email: 'blackcat22.ngu@gmail.com',
  };
  const user1 = {
    userName: 'long2291',
    password: 'long123',
  };
  describe('/auth test auth APi', () => {
    it('/auth/register (Post): success', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Content-Type', 'application/json')
        .send(userRandom)
        .expect(201)
        .expect(({ body }) => {
          expect(body.message).toEqual('An email has been sent');
        });
    });
    it('/auth/register (Post): fail', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Content-Type', 'application/json')
        .send(user)
        .expect(409)
        .expect(({ body }) => {
          expect(body.message).toEqual('Duplicate Unique Key');
        });
    });
    it('/auth/login (Post): success', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          userName: user.userName,
          password: user.password,
        })
        .expect(200)
        .expect(({ body }) => {
          jwt = body.access_token;
        });
    });
    it('/auth/login (Post): fail', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          userName: 'long22asdas9',
          password: 'long123',
        })
        .expect(401);
    });
  });
  describe('/user test user APi', () => {
    it('/user (GET)', () => {
      return request(app.getHttpServer())
        .get('/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200)
        .expect(({ body }) => {
          expect(body.userName).toEqual(user.userName);
        });
    });
    it('/user/change-password (PATCH) : Success', () => {
      return request(app.getHttpServer())
        .patch('/user/change-password')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          password: 'long123',
          new_password: 'long123',
          rep_new_password: 'long123',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.userName).toEqual(user.userName);
        });
    });
    it('/user/change-password (PATCH) : Fail', () => {
      return request(app.getHttpServer())
        .patch('/user/change-password')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          password: 'long1213',
          new_password: 'long123',
          rep_new_password: 'long123',
        })
        .expect(401);
    });
    it('/user/update-info (PATCH) : Success', () => {
      return request(app.getHttpServer())
        .patch('/user/update-info')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          name: 'Duong Van Long',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.name).toEqual(user.name);
        });
    });
  });
  // eslint-disable-next-line no-var
  var id: number = undefined;
  const photo = {
    name: 'ÀDSSDSD',
    link: 'http://dasdasdsa.com/sdasdasd',
  };
  const photo1 = {
    name: 'ÀDSSDSDdasdasd',
    link: 'http://dasdasdsa.com/sdasdasddasdas',
  };
  describe('/photo test Photo APi', () => {
    it('/photo/create (POST)', () => {
      return request(app.getHttpServer())
        .post('/photo/create')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send(photo)
        .expect(201)
        .expect(({ body }) => {
          expect(body.name).toEqual(photo.name);
          id = body.id;
        });
    });
    it('/photo/update (PUT)', () => {
      return request(app.getHttpServer())
        .put(`/photo/update/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send(photo1)
        .expect(200)
        .expect(({ body }) => {
          expect(body.name).toEqual(photo1.name);
          expect(body.link).toEqual(photo1.link);
        });
    });
    it('/photo/delete (DELETE) : SUCCESS', () => {
      return request(app.getHttpServer())
        .delete(`/photo/delete`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.affected).toEqual(1);
        });
    });
    it('/photo/delete (DELETE) :FAIL', () => {
      return request(app.getHttpServer())
        .delete(`/photo/delete`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 30,
        })
        .expect(404);
    });
  });
  const album = {
    name: 'Du lich',
    description: 'DSDDSDSDDSSDD',
  };
  describe('/album test Album APi', () => {
    it('/album/create-album (POST)', () => {
      return request(app.getHttpServer())
        .post('/album/create-album')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send(album)
        .expect(201)
        .expect(({ body }) => {
          expect(body.name).toEqual(album.name);
          id = body.id;
        });
    });
    it('/album/id (GET) : SUCCESS', () => {
      return request(app.getHttpServer())
        .get(`/album/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(id);
        });
    });
    it('/album/id (GET) : Fail', () => {
      return request(app.getHttpServer())
        .get(`/album/${1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(404);
    });
    it('/album/add-user (PUT) : Success', () => {
      return request(app.getHttpServer())
        .put(`/album/add-user/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 4,
        })
        .expect(200)
        .expect(({ body }) => {
          console.log(body);
          expect(body.id).toEqual(4);
        });
    });
    it('/album/add-user (PUT) : Failed Album', () => {
      return request(app.getHttpServer())
        .put(`/album/add-user/${1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 84,
        })
        .expect(404);
    });
    it('/album/add-user (PUT) : Failed User', () => {
      return request(app.getHttpServer())
        .put(`/album/add-user/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 4,
        })
        .expect(400);
    });
    it('/album/add-photo/:id (PUT) : Success', () => {
      return request(app.getHttpServer())
        .put(`/album/add-photo/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 6,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(id);
        });
    });
    it('/album/add-photo/:id (PUT) : Failed', () => {
      return request(app.getHttpServer())
        .put(`/album/add-photo/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 30,
        })
        .expect(404);
    });
    it('/album/delete-user/:id (DELETE) : Success', () => {
      return request(app.getHttpServer())
        .delete(`/album/delete-user/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 4,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(id);
        });
    });
    it('/album/delete-user/:id (DELETE) : Failed', () => {
      return request(app.getHttpServer())
        .delete(`/album/delete-user/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 84,
        })
        .expect(404);
    });
    it('album/delete-album (DELETE) : Success', () => {
      return request(app.getHttpServer())
        .delete(`/album/delete-album`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id,
        })
        .expect(200);
    });
    it('album/delete-album (DELETE) : Failed', () => {
      return request(app.getHttpServer())
        .delete(`/album/delete-album`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({
          id: 0,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.affected).toEqual(0);
        });
    });
  });
});
