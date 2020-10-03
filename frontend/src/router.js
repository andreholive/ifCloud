import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Logon from './pages/Logon';
import Main from './pages/Main';
import Admin from './pages/Admin'
import Projects from './pages/Projects'
import ProjectMain from './pages/ProjectMain'



export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Logon} />
                <Route path="/projects" component={Projects} />
                <Route path="/admin" component={Admin} />
                <Route path="/project" component={ProjectMain} />
            </Switch>
        </BrowserRouter>
    )
}