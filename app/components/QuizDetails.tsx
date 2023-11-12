

const QuizDetails = ({ quiz  }: any) => (
    <div className='mb-4'>
      <p>Score: {quiz.score}</p>
      <p>Total Questions: {quiz.totalQuestions}</p>
      <p>Time: {quiz.time}</p>
      <p>Quiz ID: {quiz.quizId}</p>
      <p>Quiz Name: {quiz.quizName}</p>
      <p>Course: {quiz.course}</p>
      <p>Course Code: {quiz.courseCode}</p>
    </div>
  );

  export default QuizDetails;