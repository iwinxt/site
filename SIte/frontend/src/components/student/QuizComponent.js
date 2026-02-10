export class QuizComponent {
    constructor(container, quiz) {
        this.container = container;
        this.quiz = quiz;
        this.selectedAnswer = null;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="quiz">
                <h3>Quiz</h3>
                <p class="quiz__question">${this.quiz.question}</p>
                <div class="quiz__options">
                    ${this.quiz.options.map((option, index) => `
                        <label class="quiz__option">
                            <input type="radio" name="quiz-${this.quiz.id}" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
                <button class="quiz__submit" id="submitQuiz">Verificar Resposta</button>
                <div class="quiz__result" id="quizResult"></div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const options = this.container.querySelectorAll('input[type="radio"]');
        options.forEach(option => {
            option.addEventListener('change', (e) => {
                this.selectedAnswer = parseInt(e.target.value);
            });
        });

        const submitBtn = document.getElementById('submitQuiz');
        submitBtn.addEventListener('click', () => this.checkAnswer());
    }

    checkAnswer() {
        if (this.selectedAnswer === null) {
            alert('Selecione uma resposta');
            return;
        }

        const resultEl = document.getElementById('quizResult');
        const isCorrect = this.selectedAnswer === this.quiz.correct_answer;

        resultEl.className = `quiz__result ${isCorrect ? 'correct' : 'incorrect'}`;
        resultEl.textContent = isCorrect 
            ? '✓ Resposta correta!' 
            : `✗ Resposta incorreta. A resposta correta é: ${this.quiz.options[this.quiz.correct_answer]}`;
    }
}