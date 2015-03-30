<div id="login-box">
	<?php echo form_open("admin/users/login", 'id="login-form"');?>
	<fieldset>
				<div class="row">
				<label for="email"><?php echo lang('login:username') ?>:</label>
				<?php echo form_input(array(
					'name'	=> 'username',
					'id'	=> 'username',
					'type'	=> 'text',
					'class'	=> 'txt',
					'value' => set_value('username'),
                                        'placeholder' => 'Username',                                        
				));?>
				</div>
				<div class="row">
					<label for="password"><?php echo lang('login:password') ?>:</label>
					<?php echo form_input(array(
						'name'	=> 'password',
						'id'	=> 'password',
						'type'	=> 'password',
						'class'	=> 'txt',
                                                'placeholder' => 'Password',                                            
					));?>
				</div>
            
				<div class="row">
					<label for="remember"><?php echo lang('login:remember') ?>:</label>
					<?php echo form_checkbox('remember', '1', set_checkbox('remember', '1', FALSE), 'style="margin-top: 10px"');?>
				</div>

				<div>
						<input type="submit" class="hidden-submit" />
						<a href="#" class="yellow-btn" onclick="document.getElementById('login-form').submit();"><span>&nbsp;&nbsp;<?php echo lang('login:login') ?>&nbsp;&nbsp;</span></a>
				</div>
	</fieldset>
<?php echo form_close();?>
<?php  if (Settings::get('google_auth')== 1) { ?>
                                 <span class="add-on">
                                     <a href="/ananas2/social/session/google/" title="Sign in via Google">
                                        <img class="favicon" src="/ananas2/app/modules/users/img/google.jpg" alt="google" />
                                     </a>
<?php } ?>
<?php  if (Settings::get('twitter_auth')== 1) { ?>                                     
                                     <a href="/ananas2/social/session/twitter/" title="Sign in via Twitter">
                                        <img class="favicon" src="/ananas2/app/modules/users/img/twitter.jpg" alt="google" />
                                     </a>
                                </span>                                    
<?php } ?>
</div>