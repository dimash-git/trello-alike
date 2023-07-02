import axios from "axios";
import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
  // function returns a promise that resolves to an AxiosResponse

  const todos = formatTodosForAI(board);

  const headers = {
    "Content-Type": "application/json",
  };
  const res = await axios.post("/api/generateSummary", { todos }, { headers });

  const { content } = res.data;

  return content;
};

export default fetchSuggestion;
