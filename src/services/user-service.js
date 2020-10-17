import axios from 'axios';

class UserService {
  constructor() {
    this.user = axios.create({
      baseURL: 'https://localhost:3800',
      withCredentials: true,
    })
  }

  getOneUser = (id) => {
    return this.user.get(`/users/one/${id}`).then(({data}) => data);
  }

  getUserList = () => {
    return this.user.get('/users/')
    .then(({data}) => data);
  }

  getTeachersList = () => {
    return this.user.get('/users/teachers')
      .then(({ data }) => data);
  }

  getAlumnsList = () => {
    return this.user.get('/users/alumns')
    .then(({ data }) => data);
  }

  getUserChats = (id) => this.user.get(`/users/${id}/chats`).then(({data}) => data);

  addSubjectsInUser = (user, subjects) => {
    const { _id } = user;
    const data = {
      subjects: subjects
    }
    return this.user.post(`/users/${_id}/addSubjects`, data)
    .then(({ data }) => data);
  }

}

const userService = new UserService();

export default userService;