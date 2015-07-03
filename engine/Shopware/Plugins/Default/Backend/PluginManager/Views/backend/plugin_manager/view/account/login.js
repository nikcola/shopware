//{namespace name=backend/plugin_manager/translation}
Ext.define('Shopware.apps.PluginManager.view.account.Login', {
    extend: 'Ext.container.Container',

    cls: 'plugin-manager-login-window',

    /**
     * Contains all snippets for the view component
     * @object
     */
    snippets: {
        title: '{s name=account/login/title}Already have an account?{/s}',
        shopwareId: '{s name=account/login/shopwareId}Shopware ID{/s}',
        password: '{s name=account/login/password}Password{/s}',
        passwordMessage: '{s name=account/login/passwordMessage}The passwords do not match.{/s}',
        forgotPassword: '{s name=account/login/forgotPassword}Forgot your password?{/s}',
        forgotPasswordLink: '{s name=account/login/forgotPasswordLink}https://account.shopware.com/#/forgotPassword{/s}',
        registerDomain: '{s name=account/login/register_domain}Register domain{/s}',
        cancelButton: '{s name="account/login/cancel"}Cancel{/s}',
        loginButton: '{s name="account/login/login"}Login{/s}'
    },

    width: 360,
    anchor: '100%',
    border: false,

    initComponent: function () {
        var me = this;

        me.items = [
            me.createForm()
        ];

        me.callParent(arguments);
    },

    createForgotLink: function () {
        var me = this;

        return Ext.create('Ext.Component', {
            html: '<a href="' + me.snippets.forgotPasswordLink + '" target="_blank">' + me.snippets.forgotPassword + '</a>',
            cls: 'forgot'
        });
    },

    createForm: function () {
        var me = this;

        me.formPanel = Ext.create('Ext.form.Panel', {
            border: false,
            layout: {
                type: 'vbox'
            },
            anchor: '100%',
            cls: 'form-panel',
            items: [
                me.createLoginText(),
                me.createShopwareIdField(),
                me.createPasswordField(),
                me.createForgotLink(),
                me.createRegisterDomainField(),
                me.createActionButtons()
            ]
        });

        return me.formPanel;
    },

    createLoginText: function() {
        var me = this;

        return {
            border: false,
            margin: '0 0 10 0',
            html: '<span class="section-title">' + me.snippets.title + '</span>'
        };
    },

    createActionButtons: function () {
        var me = this;

        me.cancelButton = Ext.create('PluginManager.container.Container', {
            html: me.snippets.cancelButton,
            cls: 'cancel-button',
            handler: function () {
                Shopware.app.Application.fireEvent('destroy-login');
            }
        });

        me.registerButton = Ext.create('PluginManager.container.Container', {
            html: me.snippets.loginButton,
            cls: 'plugin-manager-action-button primary',
            margin: '0 30 0 0',
            handler: function () {
                me.applyLogin();
            }
        });

        me.actionButtons = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'bottom',
            background: '#fff',
            cls: 'toolbar',
            margin: '10 0 0 0',
            width: 360,
            items: [me.cancelButton, '->', me.registerButton]
        });

        return me.actionButtons;

    },

    createRegisterDomainField: function() {
        var me = this;

        me.LoginRegisterDomain = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: me.snippets.registerDomain,
            name: 'registerDomain',
            boxLabel: me.snippets.registerDomain,
            cls: 'input--field',
            labelWidth: 130
        });

        return me.LoginRegisterDomain;
    },

    createShopwareIdField: function () {
        var me = this;

        me.shopwareIdField = Ext.create('Ext.form.field.Text', {
            name: 'shopwareID',
            fieldLabel: me.snippets.shopwareId,
            allowBlank: false,
            cls: 'input--field',
            emptyText: me.snippets.shopwareId,
            margin: '10 0',
            labelWidth: 130,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.applyLogin();
                    }
                }
            }
        });

        return me.shopwareIdField;
    },

    createPasswordField: function () {
        var me = this;

        me.passwordField = Ext.create('Ext.form.field.Text', {
            name: 'password',
            fieldLabel: me.snippets.password,
            allowBlank: false,
            labelWidth: 130,
            cls: 'input--field',
            emptyText: me.snippets.password,
            inputType: 'password',
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.applyLogin();
                    }
                }
            }
        });

        return me.passwordField;
    },

    applyLogin: function () {
        var me = this;

        if (!me.formPanel.getForm().isValid()) {
            return;
        }

        var loginData = me.formPanel.getForm().getValues();

        loginData.registerDomain = loginData.registerDomain === "on";
        loginData.shopwareId = loginData.shopwareID;

        Shopware.app.Application.fireEvent(
            'store-login',
            loginData,
            function () {
                me.callback();
            }
        );
    }
});