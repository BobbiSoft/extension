/* global moment, chrome */

$(function () {
    var SCHEDULE_URL = "https://my-alternate.rhcloud.com/get-schedule/schedule/";
    var messages = {
        select_group: "Выберите свою группу на <a href='https://my-alternate.rhcloud.com' target='_blank'>сайте расписания</a>, после чего я автоматически произведу синхронизацию",
        error: "Ошибка при загрузке данных с сервера. Попробуйте позже",
        wait: "Загрузка..."
    };
    var message = $("#message");
    var id = localStorage.id;
    var group = localStorage.group;
    var anchor = 0;
    var prevWeek = $("#prev-week");
    var nextWeek = $("#next-week");
    var currDate = null;




    chrome.runtime.sendMessage({text: "schedule"}, function (data) {
        message.html(messages.wait);
        if (data) {
            anchor = data.anchor;
            currDate = new Date(data.date);
            if (anchor === -1) prevWeek.hide();
            if (anchor === 1) nextWeek.hide();
            renderSchedule(data.schedule);
        }
        else {
            if (!id || !group)
                return message.html(messages.select_group);
            getSchedule();
        }
    });

    function getSchedule() {
        $.get(SCHEDULE_URL + id + "&" + anchor).success(function (response, res, xhr) {
            currDate = new Date(xhr.getResponseHeader("Date"));
            chrome.runtime.sendMessage({text: "schedule", data: {schedule: response, anchor: anchor, date: currDate.toString()}});
            renderSchedule(response);
        }).error(function () {
            message.html(messages.error).show();
        });
    }

    prevWeek.click(function () {
        if (anchor === -1) return;
        if (anchor === 0) prevWeek.hide();
        anchor--;
        nextWeek.show();
        getSchedule();

    });
    nextWeek.click(function () {
        if (anchor === 1) return;
        if (anchor === 0) nextWeek.hide();
        prevWeek.show();
        anchor++;
        getSchedule();
    });

    function renderSchedule(response) {
        var lectSchedule = {
            1: '7.30-8.50',
            2: '9.00-10.20',
            3: '10.30-11.50',
            4: '12.05-13.25',
            5: '13.35-14.55',
            6: '15.05-16.25',
            7: '16.35-17.55',
            8: '18.05-19.25'
        };
        var schedule = $("#schedule");
        var scheduleGroup = $("#schedule-group");
        var slider = $(".carousel-inner").html("");
        var indicators = $(".carousel-indicators").html("");

        response.days.forEach(function (day, indx) {
            var d = renderDay(day, indx);
            slider.append(d.day);
            indicators.append(d.indicator);
        });
        var cD = currDate.getDay() - 1;
        if (cD === -1) cD = 6;
        if (anchor === 0 && cD !== 6 || (anchor === -1 && cD === 6)) {
            slider.find(".item:eq(" + cD + ")").addClass("panel-danger active");
            indicators.find("li:eq(" + cD + ")").addClass("active");
        }
        else {
            slider.find(".item:first").addClass("active");
            indicators.find("li:first").addClass("active");
        }
        scheduleGroup.text(group);
        message.hide();
        schedule.show();
        $("#schedule-slider").carousel({
            interval: false
        });

        function renderDay(day, indx) {
            var container = $('<div class="item">').addClass('panel panel-info');
            container.append($('<div>').addClass('panel-heading').text(day.name + ' ' + date(day.date)));
            var table = $('<table>').addClass('table table-hover');
            table.append($('<col>').addClass('lesson_number'));
            table.append($('<col>').addClass('lesson_text'));

            day.lectures.forEach(function (lecture) {
                if (lecture.text === '') return;
                table.append(renderLecture(lecture));
            });
            container.append(table);

            var indicator = $('<li data-slide-to="' + indx + '" data-target="#schedule-slider"></li>');

            return {day: container, indicator: indicator};
        }

        function renderLecture(lecture) {
            return $('<tr>')
                    .append($('<td>').text(lecture.number))
                    .append($('<td>').text(lecture.text)
                            .append('<br>')
                            .append($('<i>')
                                    .append(lectSchedule[lecture.number])));
        }

        function date(raw) {
            return moment(raw).format('DD.MM.YYYY');
        }
    }
});