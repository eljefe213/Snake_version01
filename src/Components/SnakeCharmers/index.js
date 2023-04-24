import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import firebase from "../../Firebase/Config";
import "../SnakeCharmers/charmer.css";

function useScore() {
  const [score, setScore] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("ScoreBoard")
      .orderBy("score", "desc")
      .onSnapshot((snapshot) => {
        const newScore = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScore(newScore);
      });
  }, []);
  return score.slice(0, 7);
}

function SnakeCharmers() {
  const score = useScore();
  return (
    <div>
      <h1 style={{ textAlign: "center", display: "none" }}>
        &#10027; Best Snake Trainers &#10027;
      </h1>
      <div>
        <Table className="table" variant="light">
          <tbody>
            {score.map((item) => (
              <tr key={item.id}>
                <td
                  style={{
                    background: "white",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  {item.mame}
                </td>
                <td
                  style={{
                    background: "white",
                    borderBottom: "1px solid black",
                  }}
                >
                  {item.score}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default SnakeCharmers;
