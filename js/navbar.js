var navbar =" <div class='navbar-header'> <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'> <span class='sr-only'>Toggle navigation</span> <span class='icon-bar'></span> <span class='icon-bar'></span> <span class='icon-bar'></span> </button> <a class='navbar-brand' href='index.html'>RAFFLE</a> </div><ul class='nav navbar-top-links navbar-right'> <li class='dropdown'> <a class='dropdown-toggle' data-toggle='dropdown' href='#'> <i class='fa fa-user fa-fw'></i> <i class='fa fa-caret-down'></i> </a> <ul class='dropdown-menu dropdown-user'> <li><a href='#'><i class='fa fa-user fa-fw'></i> User Profile</a> </li><li><a href='#'><i class='fa fa-gear fa-fw'></i> Settings</a> </li><li class='divider'></li><li><a href="#" id='logout'<i class='fa fa-sign-out fa-fw'></i> Logout</a> </li></ul> </li></ul> <div class='navbar-default sidebar' role='navigation'> <div class='sidebar-nav navbar-collapse'> <ul class='nav' id='side-menu'><li> <a href=''><i class='fa fa-edit fa-fw'></i>Results<span class='fa arrow'></span></a> <ul class='nav nav-second-level'> <li> <a href='./classres.html'>Class Results</a> </li><li> <a href='./rangeresult.html'>Range Results</a> </li><li> <a href='./csvres.html'>Upload CSV</a> </li><li> <a href='./singleresult.html'>Single Result</a> </li></ul> </li><li> <a href='forms.html'><i class='fa fa-tasks fa-fw'></i>Results Analysis</a> </li><li> <a href='#'><i class='fa fa-edit fa-fw'></i>Faculty Feedback</a> </li><li> <a href='#'><i class='fa fa-files-o fa-fw'></i>About</a> </li></ul> </div></div>";
document.getElementById('Navigation-Bar').innerHTML = navbar;