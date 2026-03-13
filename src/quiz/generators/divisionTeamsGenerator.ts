import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDivisionTeamsQuestion(id: number): Question {
  const teamSize = randInt(2, 6);
  const numTeams = randInt(4, 12);
  const totalChildren = teamSize * numTeams;
  return {
    category: "Division",
    id,
    type: "division-teams",
    prompt: `${totalChildren} children are divided into teams. Each team has ${teamSize} children. How many teams are there?`,
    data: { totalChildren, teamSize },
    correctAnswer: numTeams,
  };
}
