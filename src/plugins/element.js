import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
import { Container, Header, Aside, Main } from 'element-ui'
import { Menu, Submenu, MenuItemGroup, MenuItem } from 'element-ui'
import { Breadcrumb, BreadcrumbItem, Card, Row, Col } from 'element-ui'
import { Table, TableColumn, Switch, Tooltip, Pagination } from 'element-ui'
import { Dialog } from 'element-ui'
import { MessageBox, Tag, Tree, Select, Option, Cascader } from 'element-ui'
import { Alert, Tabs, TabPane, Steps, Step } from 'element-ui'
import { CheckboxGroup, Checkbox, Upload } from 'element-ui'
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
