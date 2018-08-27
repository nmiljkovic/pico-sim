<template>
  <div class="app">
    <section class="toolbar-section">
      <toolbar/>
    </section>
    <section class="content-section">
      <code-editor class="code-editor-pane"/>
      <hardware class="hardware-pane"/>
    </section>
    <section class="footer-section">
      <footer-tabs class="footer-tabs"/>
    </section>
  </div>
</template>

<script>
  import Toolbar from "./Toolbar";
  import CodeEditor from "./CodeEditor";
  import FooterTabs from "./FooterTabs";
  import Hardware from "./Hardware";

  export default {
    name: "app",
    components: {
      Toolbar,
      CodeEditor,
      FooterTabs,
      Hardware,
    },
  };
</script>

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .toolbar-section {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .content-section {
    flex: 1 1 auto;

    display: flex;
    overflow: hidden;
  }

  .code-editor-pane {
    flex: 1 1 auto;
  }

  .hardware-pane {
    border-left: 1px solid #ddd;
    flex: 0 0 30%;
  }

  .footer-section {
    border-top: 1px solid #ddd;
    flex: 0 1 auto;
  }

  .footer-tabs .tab-content {
    overflow-y: scroll;
    height: 250px;
  }
</style>
