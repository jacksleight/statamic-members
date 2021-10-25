<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Route
    |--------------------------------------------------------------------------
    |
    | The route prefix used for all form pages.
    |
    */

    'route' => 'account',

    /*
    |--------------------------------------------------------------------------
    | Enable Register
    |--------------------------------------------------------------------------
    |
    | Whether the register page should be enabled.
    |
    */

    'enable_register' => true,

    /*
    |--------------------------------------------------------------------------
    | Enable Password
    |--------------------------------------------------------------------------
    |
    | Whether the account password page should be enabled.
    |
    */

    'enable_password' => true,
    
    /*
    |--------------------------------------------------------------------------
    | Enable Edit
    |--------------------------------------------------------------------------
    |
    | Whether the account edit page should be enabled.
    |
    */

    'enable_edit' => true,

    /*
    |--------------------------------------------------------------------------
    | Fillable
    |--------------------------------------------------------------------------
    |
    | Which user fields are fillable through the edit form
    |
    */

    'fillable' => [
        'name',
        'email',
    ],

];