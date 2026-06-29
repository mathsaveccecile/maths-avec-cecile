const capsuleData = {
  title: "Pythagore",
  levels: "4e / 3e",
  duration: "18 min",

  steps: [
    {
      type: "image",
      title: "Comment fonctionne la capsule ?",
      src: "pythagore.png"
    },

    {
      type: "video",
      title: "0. Introduction",
      src: ""
    },

    {
      type: "pdf",
      title: "Fiche méthode",
      src: "assets/Pythagore/pdfs/fiche1.pdf",
      loginRequired: true
    },

    {
      type: "quiz",
      quizType: "qcm",
      title: "QCM",
      question: "Quelle est la valeur de $\\sqrt{81}$ ? Et comment écrit-on l'angle $\\widehat{ABC}$ ?",
      answers: [
        "$9$ et $\\widehat{ABC}$",
        "$8$ et $ABC$",
        "$81$ et $\\angle ABC$"
      ],
      correctAnswer: "$9$ et $\\widehat{ABC}$"
    }
  ]
};