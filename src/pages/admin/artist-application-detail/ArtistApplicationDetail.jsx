import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  logInByRefreshToken,
  authExceptionHandler,
} from "../../../components/auth/AuthUtil";
import axios from "axios";

const ArtistApplicationDetail = () => {
  const { id } = useParams();
  const [artistApplication, setArtistApplication] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("처리중");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (
      !localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
      await logInByRefreshToken();
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/artist-application/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        }
      );
      setArtistApplication(response.data.data);
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        authExceptionHandler(error, fetchData);
      } else {
        console.log(error);
      }
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleFormSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/admin/artist-application/${id}`,
        {
          status: selectedStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      alert("처리 성공");
      window.location.reload();
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        authExceptionHandler(error, handleFormSubmit);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div>Application ID: {artistApplication.artistApplicationId}</div>
      <div>가수 이름: (artistApplication.artistName)</div>
      <div>앨범 이름: {artistApplication.albumName}</div>
      <div>저자 이름: {artistApplication.authorName}</div>
      <div>저작권자 이름: {artistApplication.copyrightName}</div>
      <div>국내외 구분: {artistApplication.locationType}</div>
      <div>장르: {artistApplication.sector}</div>
      <select onChange={handleStatusChange}>
        <option>처리중</option>
        <option>삭제</option>
        <option>거절</option>
        <option>처리완료</option>
      </select>
      <button onClick={handleFormSubmit}>신청서 처리하기</button>
      <div>처리 상태: {artistApplication.status}</div>
    </div>
  );
};

export default ArtistApplicationDetail;
