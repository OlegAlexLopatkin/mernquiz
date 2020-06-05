import React, { useState } from "react";
import { useSelector } from "react-redux";
import classes from "./QuizCreator.module.css";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Select from "../../components/UI/Select/Select";
import {
  createControl,
  validate,
  validateForm
} from "../../form/formFramework";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import axios from "../../axios/axios-quiz";

function createOptionControl(number) {
  return createControl(
    {
      label: `Вариант ${number}`,
      errorMessage: "Значение не может быть пустым",
      id: number
    },
    { required: true }
  );
}

function createTitleControl() {
  return createControl(
    {
      label: `Введите название теста`,
      errorMessage: "Значение не может быть пустым",
      id: 6
    },
    { required: true }
  );
}

function createFormControls() {
  return {
    question: createControl(
      {
        label: "Введите вопрос",
        errorMessage: "Вопрос не может быть пустым"
      },
      { required: true }
    ),
    option1: createOptionControl(1),
    option2: createOptionControl(2),
    option3: createOptionControl(3),
    option4: createOptionControl(4)
  };
}

const QuizCreator = props => {
  const initialState = {
    isFormValid: false,
    rightAnswerId: [1],
    formControls: [createFormControls()],
    questionNumber: 0,
    quizTitle: createTitleControl()
  };

  const [state, setState] = useState(initialState);
  const { token } = useSelector(state => state.auth);

  const submitHandler = event => {
    event.preventDefault();
  };

  const addQuestionHandler = event => {
    const formControls = [...state.formControls];
    formControls.splice(state.questionNumber + 1, 0, createFormControls());
    const rightAnswerId = [...state.rightAnswerId];
    rightAnswerId.splice(state.questionNumber + 1, 0, 1);
    setState({
      ...state,
      formControls,
      isFormValid: false,
      rightAnswerId,
      questionNumber: state.questionNumber + 1
    });
  };

  const deleteQuestionHandler = () => {
    let formControls = [...state.formControls];
    formControls.splice(state.questionNumber, 1);
    let rightAnswerId = [...state.rightAnswerId];
    rightAnswerId.splice(state.questionNumber, 1);
    let questionNumber = state.questionNumber;
    let isFormValid = true;
    if (questionNumber > formControls.length - 1) {
      questionNumber = formControls.length - 1;
      if (questionNumber < 0) {
        rightAnswerId = [1];
        formControls = [];
        questionNumber = 0;
        isFormValid = false;
      }
    }

    setState({
      ...state,
      formControls,
      rightAnswerId,
      isFormValid,
      questionNumber
    });
  };

  const createQuizHandler = async event => {
    event.preventDefault();

    let quiz = state.formControls.map((item, index) => {
      const { question, option1, option2, option3, option4 } = item;

      return {
        question: question.value,
        id: index + 1,
        rightAnswerId: state.rightAnswerId[index],
        answers: [
          { text: option1.value, id: option1.id },
          { text: option2.value, id: option2.id },
          { text: option3.value, id: option3.id },
          { text: option4.value, id: option4.id }
        ]
      };
    });

    await axios.post(`/quizes`, {
      quiz,
      quizTitle: state.quizTitle.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    props.history.push("/myquiz/");
  };

  const changeHandler = (value, controlName) => {
    const formControls = {
      ...state.formControls[state.questionNumber]
    };
    const control = { ...formControls[controlName] };
    const arr = [...state.formControls];
    control.touched = true;
    control.value = value;
    control.valid = validate(control.value, control.validation);

    formControls[controlName] = control;
    arr[state.questionNumber] = formControls;
    let isFormValid =
      state.questionNumber > 0
        ? validateForm(formControls)
        : validateForm(formControls) && state.quizTitle.valid;
    setState({
      ...state,
      formControls: arr,
      isFormValid
    });
  };
  const changeTitleHandler = (value, control) => {
    const formControls = { ...state.formControls[0] };
    control.touched = true;
    control.value = value;
    control.valid = validate(control.value, control.validation);

    setState({
      ...state,
      quizTitle: control,
      isFormValid: validateForm(formControls) && control.valid
    });
  };

  const renderTitleControl = () => {
    const quizTitle = { ...state.quizTitle };
    if (state.formControls.length > 0) {
      return (
        <Auxiliary key={"Title6"}>
          <Input
            label={quizTitle.label}
            value={quizTitle.value}
            valid={quizTitle.valid}
            shouldValidate={!!quizTitle.validation}
            touched={quizTitle.touched}
            errorMessage={quizTitle.errorMessage}
            onChange={event =>
              changeTitleHandler(event.target.value, quizTitle)
            }
          />
          <hr />
        </Auxiliary>
      );
    } else return null;
  };
  const renderControls = () => {
    if (state.formControls.length > 0) {
      return Object.keys(state.formControls[state.questionNumber]).map(
        (controlName, index) => {
          const control = state.formControls[state.questionNumber][controlName];

          return (
            <Auxiliary key={controlName + index}>
              <Input
                label={control.label}
                value={control.value}
                valid={control.valid}
                shouldValidate={!!control.validation}
                touched={control.touched}
                errorMessage={control.errorMessage}
                onChange={event =>
                  changeHandler(event.target.value, controlName)
                }
              />
              {index === 0 ? <hr /> : null}
            </Auxiliary>
          );
        }
      );
    } else {
      return (
        <>
          <p className={classes.Message}>Все вопросы удалены</p>
          <p className={classes.Center}>
            <Button
              type="primary"
              onClick={() => props.history.push("/myquiz/")}
            >
              Отменить создание теста
            </Button>
          </p>
        </>
      );
    }
  };

  const selectChangeHandler = event => {
    const rightAnswerId = [...state.rightAnswerId];
    rightAnswerId[state.questionNumber] = +event.target.value;
    setState({
      ...state,
      rightAnswerId
    });
  };

  const nextQuestionHandler = () => {
    const questionNumber = state.questionNumber + 1;
    setState({ ...state, questionNumber });
  };

  const previousQuestionHandler = () => {
    const questionNumber = state.questionNumber - 1;
    setState({ ...state, questionNumber });
  };

  return (
    <div className={classes.QuizCreator}>
      {
        <div>
          <h1>Создание теста</h1>
          {!state.isFormValid && state.formControls.length > 0 ? (
            <p className={classes.Message}>Заполните все поля</p>
          ) : null}
          <form onSubmit={submitHandler}>
            {state.questionNumber > 0 ? null : renderTitleControl()}
            {renderControls()}
            {state.formControls.length > 0 ? (
              <>
                <Select
                  label="Выберите правильный ответ"
                  value={state.rightAnswerId[state.questionNumber]}
                  onChange={selectChangeHandler}
                  options={[
                    { text: 1, value: 1 },
                    { text: 2, value: 2 },
                    { text: 3, value: 3 },
                    { text: 4, value: 4 }
                  ]}
                />
                <p className={classes.ButtonsLine}>
                  {state.questionNumber - 1 >= 0 ? (
                    <Button
                      type="primary"
                      onClick={previousQuestionHandler}
                      disabled={!state.isFormValid}
                    >
                      Предыдущий вопрос
                    </Button>
                  ) : (
                    <span />
                  )}
                  {state.questionNumber < state.formControls.length - 1 ? (
                    <Button
                      type="primary"
                      onClick={nextQuestionHandler}
                      disabled={!state.isFormValid}
                    >
                      Следующий вопрос
                    </Button>
                  ) : (
                    <span />
                  )}
                </p>
                <p className={classes.ButtonsLine}>
                  <Button
                    type="primary"
                    onClick={addQuestionHandler}
                    disabled={!state.isFormValid}
                  >
                    Добавить вопрос
                  </Button>
                  <Button type="error" onClick={deleteQuestionHandler}>
                    Удалить вопрос
                  </Button>
                </p>
                <p className={classes.ButtonsLine}>
                  <Button
                    type="success"
                    onClick={createQuizHandler}
                    disabled={!state.isFormValid}
                  >
                    Сохранить
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => props.history.push("/myquiz/")}
                  >
                    Отменить
                  </Button>
                </p>
              </>
            ) : null}
          </form>
        </div>
      }
    </div>
  );
};

export default QuizCreator;
