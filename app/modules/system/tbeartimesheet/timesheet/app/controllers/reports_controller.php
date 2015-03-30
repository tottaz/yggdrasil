<?php
class ReportsController extends AppController
{
  var $name = 'Reports';
  var $uses = array('Task');

  function index()
  {
    $date_start = date('Y-m-d 00:00:00',strtotime('today'));
    $date_end   = date('Y-m-d 00:00:00',strtotime('tomorrow'));
    $day_this = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $day_this = $day_this[0][0];
    $day_this['date_start'] = $date_start;
    $day_this['date_end'] = $date_end;
    $this->set('day_this', $day_this);

    $date_start = date('Y-m-d 00:00:00',strtotime('yesterday'));
    $date_end   = date('Y-m-d 00:00:00',strtotime('today'));
    $day_last = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $day_last = $day_last[0][0];
    $day_last['date_start'] = $date_start;
    $day_last['date_end'] = $date_end;
    $this->set('day_last', $day_last);

    $date_start = date('Y-m-d 00:00:00',strtotime('-1 weeks sunday'));
    $date_end   = date('Y-m-d 00:00:00',strtotime('tomorrow'));
    $week_this = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $week_this = $week_this[0][0];
    $week_this['date_start'] = $date_start;
    $week_this['date_end'] = $date_end;
    $this->set('week_this', $week_this);

    $date_start = date('Y-m-d 00:00:00',strtotime('-2 weeks sunday'));
    $date_end   = date('Y-m-d 00:00:00',strtotime('-1 weeks sunday'));
    $week_last = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $week_last = $week_last[0][0];
    $week_last['date_start'] = $date_start;
    $week_last['date_end'] = $date_end;
    $this->set('week_last', $week_last);

    $date_start = date('Y-m-d 00:00:00',mktime(0,0,0,date('m'),1,date('Y')));
    $date_end   = date('Y-m-d 00:00:00',strtotime('tomorrow'));
    $month_this = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $month_this = $month_this[0][0];
    $month_this['date_start'] = $date_start;
    $month_this['date_end'] = $date_end;
    $this->set('month_this', $month_this);

    $date_start = date('Y-m-d 00:00:00',mktime(0,0,0,date('m')-1,1,date('Y')));
    $date_end   = date('Y-m-d 00:00:00',mktime(0,0,0,date('m'),1,date('Y')));
    $month_last = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $month_last = $month_last[0][0];
    $month_last['date_start'] = $date_start;
    $month_last['date_end'] = $date_end;
    $this->set('month_last', $month_last);

    $date_start = date('Y-m-d 00:00:00',mktime(0,0,0,1,1,date('Y')));
    $date_end   = date('Y-m-d 00:00:00',strtotime('tomorrow'));
    $year_this = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $year_this = $year_this[0][0];
    $year_this['date_start'] = $date_start;
    $year_this['date_end'] = $date_end;
    $this->set('year_this', $year_this);

    $date_start = date('Y-m-d 00:00:00',mktime(0,0,0,1,1,date('Y')-1));
    $date_end   = date('Y-m-d 00:00:00',mktime(0,0,0,1,1,date('Y')));
    $year_last = $this->Task->query("SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start)))) AS time, SUM(Task.amount) AS amount, SUM(Task.amount)/SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(Task.time_end,Task.time_start))))*10000 AS average FROM tasks AS Task WHERE Task.time_end >= '{$date_start}' AND Task.time_end < '{$date_end}'");
    $year_last = $year_last[0][0];
    $year_last['date_start'] = $date_start;
    $year_last['date_end'] = $date_end;
    $this->set('year_last', $year_last);

    $this->set('open_tasks', $this->Task->findAll(array('Task.time_end'=>null),null,'Task.time_start ASC'));
    $this->set('unbilled_tasks', $this->Task->findAll(array('billed'=>0,'Task.time_end'=>'!=null'),array('*','TIMEDIFF(Task.time_end,Task.time_start) AS time'),'Task.time_start ASC'));
  }

}
?>