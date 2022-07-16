#!/usr/bin/perl

use strict;
use warnings;

sub make_views {
    my $src = shift;
    my @files = `find $src -name "*.js"`;
    for my $file (@files) {
        chomp $file;
        print "export * from './$file'", "\n";
    }
}

make_views($ARGV[0]);

