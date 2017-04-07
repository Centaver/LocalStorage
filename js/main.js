"use strict";

var Modal = function () {
    
    var question = JSON.parse(localStorage.getItem('question'));
    
    this.getquestion = function () {
        return question;
    };
    
};
var View = function (model) {
    this.renderquestion = function () {
        var data = model.getquestion();
        var ol = document.createElement('ol');
        var span = document.createElement('span');
        var span = document.createElement('span');
        var t = document.createTextNode('Дайте відповідь на питання!');
        span.appendChild(t);
        ol.appendChild(span);
        for (var key in data) {
            var quest = data[key];
            var li = document.createElement('li');
            var t = document.createTextNode(quest.titel);
            li.appendChild(t);
            for (var i = 0; i < quest.ch_question.length; i++) {
                var text_quest = quest.ch_question[i];
                var label = document.createElement('label');
                var input = document.createElement('input');
                var elem_i = document.createElement('i');
                var span = document.createElement('span');
                var t = document.createTextNode(text_quest);
                if (quest.one_answer) {
                    input.setAttribute("type", "radio");
                    input.setAttribute("name", "Radios" + key);
                }
                else {
                    input.setAttribute("type", "checkbox");
                };
                input.setAttribute("dat-question", key);
                input.setAttribute("dat-step", i);
                label.appendChild(input);
                label.appendChild(elem_i);
                span.appendChild(t);
                label.appendChild(span);
                li.appendChild(label);
            };
            ol.appendChild(li);
        };
        document.body.appendChild(ol);
        var but = document.createElement('button');
        but.setAttribute('type', 'button');
        but.setAttribute('class', 'btn btn-success');
        but.setAttribute('id', 'chose');
        var t = document.createTextNode('Перевірити відповіді');
        but.append(t);
        document.body.appendChild(but);
        var div = document.createElement('div');
        var span = document.createElement('span');
        div.setAttribute('id', 'modal_form');
        span.setAttribute('id', 'modal_close');
        span.appendChild(document.createTextNode('X'));
        div.appendChild(span);
        document.body.appendChild(div);
        var div = document.createElement('div');
        div.setAttribute('id', 'overlay');
        document.body.appendChild(div);
        
    };
    
    this.showanswer = function (trueansewer) {
        var ok = true;
        for (var key in trueansewer) {
            var curelem = trueansewer[key];
            if (curelem.true_answer_index.join() != curelem.user_answer.join()){
                ok = false;    
            };
        };
        
        animatewin(ok);
    };
    
};

function animatewin(ok) {
    
    var ansvertext = 'Вітаємо ви здали тест!';
    
    if (!ok){
        ansvertext = 'Ви не склали тест!';
    };
    
    var overlay = document.getElementById('overlay');
    var opacity = 0;
    overlay.style.display = 'block';
    
    var timerId = setTimeout(function tick() {
        opacity = opacity + 0.1;
        if (opacity < 0.9) {
            overlay.style.opacity = opacity;
            timerId = setTimeout(tick, 50);
        };
    
    }, 50);
    
    
    var modal_form = document.getElementById('modal_form');
    var opacity = 0;
    modal_form.style.display = 'block';
    
    var p = document.createElement('p');
    
    if (!ok){
        p.style.color = 'red';
        ansvertext = 'Ви несклали тест!';
    };
    p.setAttribute('class','serror')
    p.appendChild(document.createTextNode(ansvertext));
    
    modal_form.appendChild(p);
    
    var timerId = setTimeout(function tick() {
        opacity = opacity + 0.1;
        if (opacity < 1) {
            modal_form.style.opacity = opacity;
            timerId = setTimeout(tick, 50);
        };
    
    }, 50);
    
};

var Controler = function (model, view) {
    
    var chose = document.getElementById('chose');
    
    chose.onclick = function () {
        var question = model.getquestion();
        for (var key in question) {
            var answer = [];
            var unswerdata = document.querySelectorAll('[dat-question="' + key + '"]');
            for (var i = 0; i < unswerdata.length; i++) {
                var element = unswerdata[i];
                var checked = unswerdata[i].checked;
                if (checked) {
                    answer.push(parseInt(element.getAttribute('dat-step')));
                };
            };
            question[key].user_answer = answer;
        };
        view.showanswer(question);
    };
    
    var clickelem = document.getElementById('modal_close');
    
    clickelem.onclick = function () {
        document.getElementById('modal_form').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        location.reload();
    };
    
    var clickelem = document.getElementById('overlay');
    
    clickelem.onclick = function () {
        this.style.display = 'none';
        document.getElementById('modal_form').style.display = 'none';
        location.reload();
    };
    
};

(function () {
    
    var question = {
        q1: {
            titel: 'Запитання 1'
            , ch_question: ['Відповідь 1', 'Відповідь 2', 'Відповідь 3', 'Відповідь 4']
            , one_answer: true
            , true_answer_index: [0]
        }
        , q2: {
            titel: 'Запитання 2'
            , ch_question: ['Відповідь 1', 'Відповідь 2', 'Відповідь 3', 'Відповідь 4']
            , one_answer: true
            , true_answer_index: [2]
        }
        , q3: {
            titel: 'Запитання 3'
            , ch_question: ['Відповідь 1', 'Відповідь 2', 'Відповідь 3', 'Відповідь 4']
            , one_answer: false
            , true_answer_index: [0, 3]
        }
        , q4: {
            titel: 'Запитання 4'
            , ch_question: ['Відповідь 1', 'Відповідь 2', 'Відповідь 3', 'Відповідь 4']
            , one_answer: true
            , true_answer_index: [1]
        }
    };
    
    localStorage.setItem('question', JSON.stringify(question));
    
    var app = {};
    app.init = function () {
        var model = new Modal();
        var view = new View(model);
        view.renderquestion();
        var controler = new Controler(model, view);
    };
    app.init();
})();