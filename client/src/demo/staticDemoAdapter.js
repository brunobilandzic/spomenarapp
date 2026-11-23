import { APPROVAL, MULTIPLE_CHOICE, OPEN } from "../components/CreateDictionary/AddQuestion/QuestionTypes";

const dictionary = {
  _id: "54487594c558bddebd9953c0",
  title: "Spomenar za ekipu",
  description: "Primjer spomenara s četiri pitanja i izmišljenim odgovorima.",
  author_username: "Spomenar demo",
  date: "2026-11-23T12:00:00.000Z",
};

const examples = [
  {
    question: "Koja ti je najdraža uspomena s ekipom?",
    type: OPEN,
    value: "Izlet na more koji smo dogovorili isti dan.",
  },
  {
    question: "Kako izgleda tvoj idealan vikend?",
    type: MULTIPLE_CHOICE,
    choices: [
      { letter: "a", choice: "Izlet u prirodu" },
      { letter: "b", choice: "Film i pizza" },
      { letter: "c", choice: "Kava koja se pretvori u cjelodnevno druženje" },
    ],
    value: "c",
  },
  {
    question: "Bi li se prijavio/la na kviz s ekipom?",
    type: APPROVAL,
    value: "Yes",
  },
  {
    question: "Koju bi pjesmu stavio/la na playlistu za ovaj spomenar?",
    type: OPEN,
    value: "Haustor – Moja prva ljubav.",
  },
];

const questions = examples.map(({ question, type, choices = [] }, order) => ({
  _id: `demo-question-${order + 1}`,
  dictionary: dictionary._id,
  question,
  type,
  choices,
  order,
}));

const reads = new Map([
  ["/api/dicts", [dictionary]],
  [`/api/dicts/${dictionary._id}`, dictionary],
  [`/api/quests/dict/${dictionary._id}`, questions],
  [`/api/answers/dict/count/${dictionary._id}`, { count: 1 }],
]);
questions.forEach(({ _id, order }) => {
  reads.set(`/api/answers/count/${_id}`, { count: 1 });
  reads.set(`/api/answers/quest/${_id}`, [{
    _id: `demo-answer-${order + 1}`,
    question: _id,
    value: examples[order].value,
    author_username: dictionary.author_username,
    date_created: dictionary.date,
  }]);
});

// Resolve the public demo's existing data requests without a network transport.
export default async function staticDemoAdapter(config) {
  const { method, url } = config;
  let data;
  if (method === "get") {
    data = reads.get(url);
  } else if (method === "post" && url === "/api/answers/dict/count") {
    const { dictionaries } = JSON.parse(config.data);
    data = dictionaries.map((id) => ({ dictionary: id, count: id === dictionary._id ? 1 : 0 }));
  }

  if (data === undefined) {
    const msg = "This request is unavailable in the static demo.";
    throw Object.assign(new Error(msg), { response: { status: 404, data: { msg } } });
  }

  return {
    data: structuredClone(data),
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
}
