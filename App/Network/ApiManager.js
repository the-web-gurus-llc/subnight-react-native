import { base_url, router } from "./URLProvider"
import apisauce from 'apisauce'

const api = apisauce.create({
  baseURL: base_url,
  headers: {
    // Accept: 'application/json',
    // 'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  timeout: 30000,
});

function login(params) { 
  return api.post(router.login, params);
}

function register(body) {
  return api.post(router.register, body);
}

function changePassword(access_token, params) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.post(router.change_password, params);
}

function accountGetProfile(access_token) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.get(router.get_current_user);
}

function updateProfile(access_token, user) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.put(`${router.users}/${user._id}`, user)
}

function accountGetClubs(access_token) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.get(router.clubs);
}

function getPosts(access_token, pageNumber) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  const params = {
    page: pageNumber
  }
  return api.get(router.posts, params);
}

function getPostsToday(access_token, pageNumber) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  // const query = {
  //   limit: 2
  // }

  // return axios.get(`${base_url}${router.posts}?page=${pageNumber}&query=${JSON.stringify(query)}`)
  return axios.get(`${base_url}${router.posts}?page=${pageNumber}`)
}

function makeReservation(access_token, body) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.post(router.reservations, body);
}

function getReservationList(access_token, body) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  const param = {
    where: {
      status: { $nin: [ 'cancelled', 'hidden' ] }
    },
  }
  return api.get(router.myReservations, param);
}

function deleteReservation(access_token, id) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.put(`${router.reservations}/${id}/hide`);
}

function updateReservation(access_token, id, body) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.put(`${router.reservations}/${id}`, body);
}

function getClub(access_token, club_id) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.get(`${router.clubs}/${club_id}`);
}

function getClubsWithPosts(access_token) {

  const query = { withPosts: true, query: { where: { has_media: true, status: 'enabled' } } }

  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.get(`${router.clubs}`, query);
}

function getConversation(access_token, body) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.get(router.conversations, body);
}

function deleteConversation(access_token, id) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.delete(`${router.conversations}/${id}`);
}

function getUser(access_token, id) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.get(`${router.users}/${id}`);
}

function getMessages(access_token, id, body) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.get(`${router.conversations}/${id}/messages`, body);
}

function sendMessage(access_token, message) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.post(router.messages, message);
}

function registerDevice(access_token, data) {
  api.setHeader('Authorization', `Bearer ${access_token}`);
  return api.post("/devices", data);
}

export const apiManager = {
  login,
  register,
  changePassword,
  accountGetProfile,
  accountGetClubs,
  getClub,
  getPosts,
  getPostsToday,
  makeReservation,
  getReservationList,
  getConversation,
  getUser,
  getMessages,
  sendMessage,
  getClubsWithPosts,
  updateProfile,
  deleteConversation,
  deleteReservation,
  updateReservation,
  registerDevice,
}