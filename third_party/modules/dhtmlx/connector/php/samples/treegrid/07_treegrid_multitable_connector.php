<?php

	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

	require("../../codebase/treegridmultitable_connector.php");

	$treegrid = new TreeGridMultitableConnector($res);
	
	$treegrid->setMaxLevel(3);
	$level = $treegrid->get_level();

	switch ($level) {
		case 0:
			$treegrid->render_table("projects", "project_id", "project_name, project_dsc", "", "");
			break;
		case 1:
			$treegrid->render_sql("SELECT teams.team_id, teams.team_name, project_team.project_id FROM teams INNER JOIN project_team ON teams.team_id=project_team.team_id", "team_id", "team_name", "", "project_id");
			break;
		case 2:
			$treegrid->render_table("developers", "developer_id", "developer_name,developer_email", "", "developer_team");
			break;
		case 3:
			$treegrid->render_table("phones", "phone_id", "phone,phone_type", "", "phone_developer");
			break;
	}

?>