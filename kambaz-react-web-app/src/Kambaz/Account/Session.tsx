import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
export default function Session({ children }: { children: any }) {
  
  //FOR MOCK PURPOSE ONLY
  const dispatch = useDispatch();
  useEffect(() => {
    // mock 
    dispatch(setCurrentUser({
      _id: "mock-user",
      username: "faculty",
      role: "FACULTY"  // 或 "STUDENT"
    }));
  }, []);

  return children;
  // const [pending, setPending] = useState(true);
  // const dispatch = useDispatch();
  // const fetchProfile = async () => {
  //   try {
  //     const currentUser = await client.profile();
  //     dispatch(setCurrentUser(currentUser));
  //   } catch (err: any) {
  //     console.error(err);
  //   }
  //   setPending(false);
  // };
  // useEffect(() => {
  //   fetchProfile();
  // }, []);
  // if (!pending) {
  //   return children;
  // }
}
