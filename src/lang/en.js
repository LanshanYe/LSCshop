export default {
  route: {
    dashboard: 'Dashboard',
    introduction: 'Introduction',
    documentation: 'ReaderManage',
    guide: 'DonationManage',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    directivePermission: 'Directive Permission',
    icons: 'InfoManage',
    components: 'Components',
    componentIndex: 'Introduction',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    dndList: 'Dnd List',
    splitPane: 'SplitPane',
    avatarUpload: 'Avatar Upload',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    readerManage: 'readerManage',
    countTo: 'CountTo',
    addAdmin: 'addAdmin',
    componentMixin: 'Mixin',
    backToTop: 'BackToTop',
    dragDialog: 'Drag Dialog',
    dragKanban: 'Drag Kanban',
    charts: 'Charts',
    keyboardChart: 'Keyboard Chart',
    lineChart: 'Line Chart',
    mixChart: 'Mix Chart',
    example: 'Example',
    nested: 'Nested Routes',
    menu1: 'Menu 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menu 2',
    Table: 'Table',
    dynamicTable: 'Dynamic Table',
    dragTable: 'Drag Table',
    inlineEditTable: 'Inline Edit',
    complexTable: 'Complex Table',
    treeTable: 'Tree Table',
    customTreeTable: 'Custom TreeTable',
    tab: 'ServiceInfo',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'resourceManage',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    exportZip: 'Export Zip',
    theme: 'ParameterSetting',
    clipboardDemo: 'ureadManage',
    i18n: 'adminManage',
    systemSetup: 'systemSetup',
    externalLink: 'External Link',
    rcard: 'readCardManage',
    ractive: 'readActiveManage',
    borrowBook: 'borrowBook',
    mainDonation: 'mainDonation',
    donationList: 'donationList',
    donationDoc: 'donationDoc',
    ReadPromotion: 'ReadPromotion',
    serviceList: 'serviceList',
    adminLog: 'adminLog'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    screenfull: 'Screenfull',
    theme: 'Theme',
    langs: 'Chinese/English',
    size: 'Global Size'
  },
  login: {
    title: 'Taoyuan County wisdom library management system',
    logIn: 'Log in',
    username: 'Username',
    password: 'Password',
    placeholder1: 'Please input username',
    placeholder2: 'Please input password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    roles: 'Your roles',
    switchRoles: 'Switch roles'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose Tinymce. See documentation for more detailed rich text editor comparisons and introductions.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    theme: 'theme',
    address: 'address',
    time: 'time',
    adminName: 'adminName',
    releaseDate: 'Release date',
    activetheme: 'activetheme',
    activeinner: 'activeinner',
    peopleCount: 'peopleCount',
    registration: 'registration',
    docType: 'docType',
    docContent: 'docContent',
    add: 'Add',
    email: 'email',
    noticeNew: 'noticeNew',
    infonews: 'infonews',
    nickname: 'nickname',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    nameinfo: 'nameinfo',
    photo: 'photo',
    register: 'register',
    opentime: 'opentime',
    copyright: 'copyright',
    nameOfLink: 'nameOfLink',
    linkWebsite: 'linkWebsite',
    hostUnit: 'hostUnit',
    coOperatingUnit: 'coOperatingUnit',
    activeObject: 'activeObject',
    date: 'Date',
    content: 'content',
    serviceType: 'serviceType',
    contentValidity: 'contentValidity',
    donationDate: 'donationDate',
    donationInner: 'donationInner',
    abstract: 'abstract',
    author: 'Author',
    docName: 'docName',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    activity: 'activity',
    activityer: 'activityer',
    speaking: 'speaking',
    display_name: 'displayname',
    description: 'description',
    phone: 'phone',
    press: 'press',
    price: 'price',
    option: 'option',
    optionTime: 'optionTime',
    qq: 'QQ',
    remarks: 'remarks',
    number: 'number',
    borrower: 'borrower',
    settleState: 'settleState',
    priceC: 'priceC ¥',
    readCard: 'readCard',
    configdescript: 'configdescript',
    configkind: 'configkind',
    configname: 'configname',
    configtype: 'configtype',
    borrowDate: 'borrowDate',
    LoginIP: 'Log in to IP',
    LoginTime: 'LoginTime',
    edit: 'Edit',
    signtime: 'signtime',
    registtype: 'registtype',
    registNum: 'registNum',
    jointype: 'jointype',
    publish: 'Publish',
    draft: 'Draft',
    startTime: 'startTime',
    endTime: 'endTime',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    username: 'username',
    avatar: 'avatar',
    realname: 'realname',
    createTime: 'createTime',
    permission: 'permission',
    name: 'name',
    showName: 'showName',
    bookname: 'bookname'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name(default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name(default file)'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  rules: {
    name: 'name is required',
    display_name: 'display_name is required',
    description: 'description is required',
    permissions: 'permissions is required'
  }
}
