// import { renderHook, act } from '@testing-library/react-hooks';
// import { useRouter } from 'next/router';
// import { auth, db, updateDoc, arrayUnion } from 'firebase/firestore';
// import toast from 'react-hot-toast';
// import { formatDateTime } from '../Date';
// import { Quiz } from '../[quizid]/page';

// jest.mock('react', () => ({
//   ...jest.requireActual('react'),
//   useState: jest.fn(),
//   useEffect: jest.fn(),
// }));

// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));

// jest.mock('firebase/firestore', () => ({
//   auth: { currentUser: { uid: 'testUid' } },
//   db: jest.fn(),
//   updateDoc: jest.fn(),
//   arrayUnion: jest.fn(),
// }));

// jest.mock('react-hot-toast', () => ({
//   success: jest.fn(),
// }));

// jest.mock('../Date', () => ({
//   formatDateTime: jest.fn(),
// }));

// describe('Quiz', () => {
//   it('handleQuizSubmit', async () => {
//     const useStateMock = (initState: any) => [initState, jest.fn()];
//     (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
//     (formatDateTime as jest.Mock).mockReturnValue('testDateTime');
//     (useState as jest.Mock)
//       .mockImplementationOnce(() => useStateMock([{ question: 'testQuestion', correctAnswer: 'testAnswer' }])) // questions
//       .mockImplementationOnce(() => useStateMock(['testAnswer'])) // selectedOptions
//       .mockImplementationOnce(() => useStateMock('testQuizId')) // quizId
//       .mockImplementationOnce(() => useStateMock('testQuizName')) // quizName
//       .mockImplementationOnce(() => useStateMock('testCourse')) // course
//       .mockImplementationOnce(() => useStateMock('testCourseCode')); // courseCode

//     const { result } = renderHook(() => Quiz());
//     await act(async () => {
//       await result.current.handleQuizSubmit();
//     });

//     expect(updateDoc).toHaveBeenCalledWith(
//       { __collection__: 'users', id: 'testUid' },
//       {
//         quizData: [
//           {
//             score: 1,
//             totalQuestions: 1,
//             selectedOptions: ['testAnswer'],
//             correctAnswers: ['testAnswer'],
//             fetchedQuestions: [{ question: 'testQuestion', correctAnswer: 'testAnswer' }],
//             quizId: 'testQuizId',
//             quizName: 'testQuizName',
//             course: 'testCourse',
//             courseCode: 'testCourseCode',
//             time: 'testDateTime',
//           },
//         ],
//       }
//     );
//     expect(useRouter().push).toHaveBeenCalledWith('/results');
//     expect(toast.success).toHaveBeenCalledWith('Quiz Submitted Succesfully!');
//   });
// });