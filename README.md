yggdrasil
===========

Yggdrasil php framework for non-public applications

Yggdrasil is a web pplication framework based on the CodeIgniter 3.0 php framework - Yggdrasil makes it easy to build web applications. We have not reinvented the wheel we have created Yggdrasil from available open-source libraries such as <a href="http://www.codeigniter.com/" rel="external">CodeIgniter</a><span style="font-size: 14px; line-height: 1.5;">,&nbsp;</span><a href="https://github.com/philsturgeon/codeigniter-restserver" rel="external" style="font-size: 14px; line-height: 1.5;">CodeIgniter Rest Server</a><span style="font-size: 14px; line-height: 1.5;">,&nbsp;</span><a href="https://github.com/benedmunds/CodeIgniter-Ion-Auth" rel="external">CodeIgniter-Ion-Auth</a><span style="font-size: 14px; line-height: 1.5;">,&nbsp;</span><a href="https://bitbucket.org/wiredesignz/codeigniter-modular-extensions-hmvc" rel="external" style="font-size: 14px; line-height: 1.5;">HMVC Modular Extensions</a><span style="font-size: 14px; line-height: 1.5;">,&nbsp;</span></div>

<h1>Software Architecture principals</h1>

The software architecture principal used is extremely DRY (Do not Repeat Yourself) and there are no code generators and endless configuration files.

The modular extension extends the CodeIgniter framework. Modules are groups of independent mini applications, typically following the MVC methodology (model, view, controller), arranged in an application modules sub-directory that can be dropped into other CodeIgniter applications. 

RESTful API

With the CodeIgniter Rest server the CodeIgniter is extended so we can create a RESTful API for the modules. See this article - Working with RESTful Services in CodeIgniter

What can you do with the RESTFul API:
You can built a javascript app for your browser that interacts with the RESTFul API to get json data that can be used by the javascript to display information.


<h1>The Default Theme</h1>
The default theme is based&nbsp;<a href="http://twitter.github.io/bootstrap/" style="line-height: 1.5;">Bootstrap</a>, Bootsrap is a intuitive and powerful mobile first front-end framework for faster and easier web development.</div>


<h1>Let's take a look at the Core Modules!</h1>

The main modules are Users, Settings, Maintenance, Modules and Logs.

The Users module is built to support group management, permission settings, user login (support local as well as LDAP), user creation.

The Settings module is used to configure the system.

The module module is used to enable or disable modules in the system, it is also used when a new module is intorudced as it will add the new module to the module table in the database.

The maintenance module is used to clear cache or backup data from the database.
The log module reads the log file created by the application when there is a problem in the applicaiton.
