import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "../../HelperFunction";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "../../Constant";
import "../Home/home.css";
import Instructions from "../../Components/Instructions";
import SnakeCharmers from "../../Components/SnakeCharmers";
import {
  Button,
  Row,
  Col,
  Container,
  Modal,
  Form,
  Toast,
} from "react-bootstrap";
import firebase from "../../Firebase/Config";
import bite from "../../Assets/Audio/bite.mp3";
import boing from "../../Assets/Audio/boing.mp3";
import ReactGa from "react-ga";
import { Helmet } from "react-helmet";

let audio = new Audio(bite);
let audio2 = new Audio(boing);

ReactGa.initialize("UA-154721739-1");
ReactGa.pageview("React Snake Screen");

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [toastShow, setToastShow] = useState(false);

  const resultGenerator = (nplayerName) => {
    firebase.firestore().collection("ScoreBoard").add({
      mame: nplayerName,
      score: snake.length,
    });
  };

  const MyVerticallyCenteredModal = (props) => {
    const [nplayerName, setNplayerName] = useState(" ");
    const postScore = () => {
      setModalShow(false);
      resultGenerator(nplayerName);
    };

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="modalApp">
          <br />
          <h4> Submit Score? </h4>
          <br />
          <Form onSubmit={postScore}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Name?"
                onChange={(e) => setNplayerName(e.target.value)}
              />
            </Form.Group>
            <Button variant="outline-dark" onClick={postScore}>
              Submit
            </Button>{" "}
            &nbsp; &nbsp; &nbsp;
            <Button variant="outline-dark" onClick={props.onHide}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    audio2.play();
    setModalShow(true);
  };

  const moveSnake = ({ keyCode }) => {
    (keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode])) ||
      (keyCode === 13 && startGame());
  };

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      audio.play();
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
    if (!gameOver) {
      switch (snake.length) {
        case 5:
          setSpeed(95);
          setToastShow(true);
          break;
        case 6:
          setToastShow(false);
          break;
        case 10:
          setSpeed(90);
          setToastShow(true);
          break;
        case 11:
          setToastShow(false);
          break;
        case 15:
          setSpeed(85);
          setToastShow(true);
          break;
        case 16:
          setToastShow(false);
          break;
        case 20:
          setSpeed(80);
          setToastShow(true);
          break;
        case 21:
          setToastShow(false);
          break;
        case 25:
          setSpeed(75);
          setToastShow(true);
          break;
        case 26:
          setToastShow(false);
          break;
        case 30:
          setSpeed(70);
          setToastShow(true);
          break;
        case 31:
          setToastShow(false);
          break;
        case 40:
          setSpeed(65);
          setToastShow(true);
          break;
        case 41:
          setToastShow(false);
          break;
        case 45:
          setSpeed(63);
          setToastShow(true);
          break;
        case 46:
          setToastShow(false);
          break;
        case 50:
          setSpeed(60);
          setToastShow(true);
          break;
        case 51:
          setToastShow(false);
          break;
        case 60:
          setSpeed(50);
          setToastShow(true);
          break;
        case 61:
          setToastShow(false);
          break;
        case 70:
          setSpeed(40);
          setToastShow(true);
          break;
        case 71:
          setToastShow(false);
          break;
        case 80:
          setSpeed(30);
          setToastShow(true);
          break;
        case 81:
          setToastShow(false);
          break;
      }
    }
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setToastShow(false);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "gray";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  useInterval(() => gameLoop(), speed);

  return (
    <Container className="App" fluid>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Classical Snake Game</title>
        <link rel="canonical" href="https://snake.motasimfoad.com/" />
        <meta
          name="description"
          content="Classical Retro snake game built using ReactJS"
        />
      </Helmet>
      <Row>
        <Col role="button" tabIndex="0" onKeyDown={(e) => moveSnake(e)} xl={7}>
          <div>
            <div className="game-board">
              <br />
              {(gameOver && (
                <h1 style={{ marginLeft: "15%", color: "orange" }}>
                  GAME OVER!
                </h1>
              )) || <h1 style={{ marginLeft: "15%" }}>Classic Snake Game</h1>}

              <div className="canvasContainer">
                <canvas
                  style={{
                    marginTop: "10px",
                    width: "70%",
                    border: "1px dotted black",
                  }}
                  ref={canvasRef}
                  width={`${CANVAS_SIZE[0]}px`}
                  height={`${CANVAS_SIZE[1]}px`}
                />
              </div>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    textAlign: "right",
                  }}
                >
                  <Button
                    style={{ marginLeft: "14%", width: "50%" }}
                    variant="outline-dark"
                    onClick={startGame}
                  >
                    START
                  </Button>
                </div>
                <div
                  style={{ width: "50%", float: "right", textAlign: "left" }}
                >
                  <p
                    style={{
                      color: "black",
                      fontSize: "20px",
                      paddingLeft: "25%",
                      paddingTop: "2%",
                    }}
                  >
                    Snake Size : <strong>{snake.length}</strong>
                  </p>
                </div>
                <br />
                <br /> <br />
                <br />
              </div>
            </div>
            <Toast
              style={{
                position: "absolute",
                top: 30,
                right: 15,
                fontSize: "17px",
                color: "red",
              }}
              show={toastShow}
            >
              <strong> Speeding Up !! </strong>
            </Toast>
          </div>
        </Col>
        <Col xl={5}>
          <Instructions />
          <SnakeCharmers />
        </Col>
      </Row>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>
  );
};

export default App;
