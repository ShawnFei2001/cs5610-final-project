
import GreenCheckmark from "./GreenCheckmark";
import QuizMenu from "./QuizMenu";
//Greencheckmark and three dots on the right
export default function QuizControlButtons({ quizId }: { quizId: string }) {
  return (
    <div className="d-flex flex-row align-items-center">
      <GreenCheckmark />
      <QuizMenu quizId={quizId} />
    </div>
  );
}
