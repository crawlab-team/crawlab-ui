import BlankLayout from './BlankLayout.vue';
import DetailLayout from './content/detail/DetailLayout.vue';
import Header from './components/Header.vue';
import ListLayout from './content/list/ListLayout.vue';
import NormalLayout from './NormalLayout.vue';
import Sidebar from './components/Sidebar.vue';
import SidebarItem from './components/SidebarItem.vue';
import SimpleLayout from './content/simple/SimpleLayout.vue';
import TabsView from './components/TabsView.vue';
import useDetail from './content/detail/useDetail';
import useList from './content/list/useList';

export {
  BlankLayout as ClBlankLayout,
  DetailLayout as ClDetailLayout,
  Header as ClHeader,
  ListLayout as ClListLayout,
  NormalLayout as ClNormalLayout,
  Sidebar as ClSidebar,
  SidebarItem as ClSidebarItem,
  SimpleLayout as ClSimpleLayout,
  TabsView as ClTabsView,
  useDetail as useDetail,
  useList as useList,
};
